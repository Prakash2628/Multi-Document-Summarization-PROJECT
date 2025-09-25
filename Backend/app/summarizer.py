import logging
import re
from typing import List
import asyncio
from model.response_models import SummaryResponse

logger = logging.getLogger(__name__)

class SummarizerService:
    """Service for generating summaries and key points from text"""
    
    def __init__(self):
        self.max_chunk_size = 4000  # For handling long texts
    
    async def summarize(self, text: str) -> SummaryResponse:
        """
        Generate a summary with key points from the provided text
        """
        try:
            # Clean and preprocess text
            cleaned_text = self._clean_text(text)
            
            if len(cleaned_text) < 100:
                raise ValueError("Text is too short to summarize effectively")
            
            # For this demo, we'll use a rule-based approach
            # In production, you'd want to use a proper NLP model or API
            key_points = await self._extract_key_points(cleaned_text)
            summary = await self._generate_summary(cleaned_text)
            
            # Calculate statistics
            statistics = {
                "originalLength": len(text),
                "summaryLength": len(summary),
                "compressionRatio": (len(summary) / len(text)) * 100 if len(text) > 0 else 0
            }
            
            return SummaryResponse(
                keyPoints=key_points,
                summary=summary,
                statistics=statistics
            )
            
        except Exception as e:
            logger.error(f"Error during summarization: {str(e)}")
            raise
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,!?;:()\-]', '', text)
        return text.strip()
    
    async def _extract_key_points(self, text: str) -> List[str]:
        """
        Extract key points from text using rule-based approach
        In production, use a proper NLP model
        """
        sentences = self._split_into_sentences(text)
        
        # Simple scoring based on sentence characteristics
        scored_sentences = []
        
        for sentence in sentences:
            score = 0
            sentence_lower = sentence.lower()
            
            # Longer sentences tend to be more informative
            if 20 <= len(sentence.split()) <= 40:
                score += 2
            
            # Sentences with numbers/statistics
            if re.search(r'\d+', sentence):
                score += 1
            
            # Sentences with important keywords
            important_keywords = [
                'important', 'significant', 'key', 'main', 'primary', 'essential',
                'critical', 'major', 'fundamental', 'conclusion', 'result', 'findings',
                'therefore', 'consequently', 'however', 'furthermore', 'moreover'
            ]
            
            for keyword in important_keywords:
                if keyword in sentence_lower:
                    score += 1
            
            # Avoid very short or very long sentences
            if len(sentence.split()) < 8 or len(sentence.split()) > 50:
                score -= 1
            
            scored_sentences.append((sentence, score))
        
        # Sort by score and select top sentences
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        
        # Take top 5-8 sentences as key points
        num_points = min(8, max(3, len(scored_sentences) // 10))
        key_points = [sentence for sentence, _ in scored_sentences[:num_points]]
        
        return key_points
    
    async def _generate_summary(self, text: str) -> str:
        """
        Generate a coherent summary from text
        In production, use a proper NLP model
        """
        sentences = self._split_into_sentences(text)
        
        # Select representative sentences
        summary_sentences = []
        
        # Take sentences from different parts of the text
        total_sentences = len(sentences)
        if total_sentences > 0:
            # Beginning
            summary_sentences.extend(sentences[:2])
            
            # Middle
            if total_sentences > 4:
                mid_start = total_sentences // 3
                mid_end = 2 * total_sentences // 3
                summary_sentences.extend(sentences[mid_start:mid_start + 2])
            
            # End
            if total_sentences > 2:
                summary_sentences.extend(sentences[-2:])
        
        # Remove duplicates while preserving order
        seen = set()
        unique_sentences = []
        for sentence in summary_sentences:
            if sentence not in seen:
                unique_sentences.append(sentence)
                seen.add(sentence)
        
        # Limit summary length
        summary = ' '.join(unique_sentences[:10])  # Max 10 sentences
        
        # If summary is too short, add more content
        if len(summary.split()) < 50 and len(sentences) > len(unique_sentences):
            remaining_sentences = [s for s in sentences if s not in seen]
            additional_sentences = remaining_sentences[:5]
            summary += ' ' + ' '.join(additional_sentences)
        
        return summary.strip()
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # Filter out very short sentences
        sentences = [s for s in sentences if len(s.split()) >= 5]
        
        return sentences