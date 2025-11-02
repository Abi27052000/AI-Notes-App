from adrf.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import sync_to_async
from .models import Note
from .serializers import NoteSerializer
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
import os


class NoteListCreateView(APIView):
    async def get(self, request):
        notes = await sync_to_async(list)(Note.objects.all())
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    async def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            await sync_to_async(serializer.save)()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NoteDetailView(APIView):
    async def get(self, request, pk):
        note = await Note.objects.aget(pk=pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    async def put(self, request, pk):
        note = await Note.objects.aget(pk=pk)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            await sync_to_async(serializer.save)()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    async def delete(self, request, pk):
        note = await Note.objects.aget(pk=pk)
        await note.adelete()
        return Response(status=status.HTTP_204_NO_CONTENT)



# Define Pydantic model for structured output
class GeneratedNote(BaseModel):
    """Schema for AI-generated note"""
    title: str = Field(description="A concise and descriptive title for the note (max 200 characters)")
    content: str = Field(description="Detailed, well-structured content expanding on the description. Include relevant information, explanations, and examples.")
    key_points: list = Field(description="A list of 3-5 key points or takeaways from the content")
    category: str = Field(description="A suggested category for this note (e.g., Personal, Work, Study, Ideas, etc.)")


class GenerateNoteView(APIView):
    """
    API endpoint to generate detailed notes from a short description using Gemini AI
    """
    async def post(self, request):
        try:
            # Get the short description from request
            description = request.data.get('description', '')
            
            if not description:
                return Response(
                    {'error': 'Description is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the Gemini API key from environment variable
            api_key = os.getenv('GEMINI_API_KEY')
            
            if not api_key:
                return Response(
                    {'error': 'Gemini API key not configured'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Create output parser with Pydantic model
            parser = JsonOutputParser(pydantic_object=GeneratedNote)
            
            # Create the prompt template
            prompt = PromptTemplate(
                template="""You are an expert note-taking assistant. Given a short description, generate detailed, comprehensive notes.
            
Short Description: {description}

Please expand this into detailed notes with the following structure:
- A clear, concise title
- Comprehensive content that elaborates on the description
- Key points or takeaways (as a list)
- A suggested category

{format_instructions}

Return ONLY the JSON object, nothing else.""",
                input_variables=["description"],
                partial_variables={"format_instructions": parser.get_format_instructions()}
            )
            
            # Initialize Gemini model
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=api_key,
                temperature=0.7
            )
            
            # Create the chain
            chain = prompt | llm | parser
            
            # Run synchronously in async context
            def generate_note():
                return chain.invoke({"description": description})
            
            # Execute in thread pool to avoid blocking
            parsed_output = await sync_to_async(generate_note)()
            
            # Return the structured response
            return Response({
                'success': True,
                'generated_note': parsed_output,
                'original_description': description
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {
                    'error': 'Failed to generate note',
                    'details': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
