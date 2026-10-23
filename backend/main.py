from ai_claims import classify_candidate_claims
import xml.etree.ElementTree as ET
from urllib.parse import quote_plus, urlparse
import ipaddress
import socket
import re
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from googlenewsdecoder import gnewsdecoder


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="NewsAI API",
    description="AI-powered News Credibility Analysis Backend",
    version="1.0.0"
)


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Request Model
# ============================================================

class NewsRequest(BaseModel):
    content: str
    source_url: str | None = None


class UrlRequest(BaseModel):
    url: str = Field(min_length=8, max_length=2048)

class VerifyClaimRequest(BaseModel):
    claim: str
    source_domain: str | None = None


# ============================================================
# Basic Endpoints
# ============================================================

@app.get("/")
def home():
    return {
        "message": "NewsAI Backend is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# Text Preprocessing
# ============================================================

def clean_text(text: str) -> str:
    """
    Basic text preprocessing.
    Removes unnecessary whitespace.
    """

    text = text.strip()
    text = re.sub(r"\s+", " ", text)

    return text


# ============================================================
# Source Analysis
# ============================================================

def get_domain(text: str):
    """
    Extract a domain if a URL exists in the input.
    """

    url_match = re.search(
        r"https?://[^\s]+",
        text,
        re.IGNORECASE
    )

    if not url_match:
        return None

    url = url_match.group(0)

    try:
        parsed = urlparse(url)

        domain = parsed.netloc.lower()

        if domain.startswith("www."):
            domain = domain[4:]

        return domain

    except Exception:
        return None


def analyze_source(content: str, source_url: str | None = None):
    """
    Basic source signal.

    This does not prove that a source is trustworthy.
    It only provides a prototype source signal.
    """

    domain = get_domain(source_url) if source_url else get_domain(content)

    if domain and domain.startswith("www."):
        domain = domain[4:]

    if not domain:
        return {
            "score": 10,
            "max_score": 20,
            "domain": None,
            "description": "No source domain was provided."
        }

    known_domains = {
        "reuters.com",
        "apnews.com",
        "bbc.com",
        "bbc.co.uk",
        "npr.org",
        "theguardian.com",
        "nytimes.com",
        "washingtonpost.com",
        "who.int",
        "un.org"
    }

    if domain in known_domains:
        return {
            "score": 18,
            "max_score": 20,
            "domain": domain,
            "description": "Recognized news or institutional domain."
        }

    return {
        "score": 12,
        "max_score": 20,
        "domain": domain,
        "description": "A source domain was detected but requires verification."
    }


# ============================================================
# Claim Extraction
# ============================================================



def extract_claims(content: str):
    """
    Extract candidate factual statements using lightweight rules.
    These claims are not fact-checked and require external verification.
    """

    # Normalize whitespace while preserving sentence punctuation.
    text = re.sub(r"\s+", " ", content).strip()

    # Split at normal sentence boundaries.
    sentences = re.split(
        r'(?<=[.!?])\s+(?=["“‘]?[A-Z0-9])',
        text
    )

    # Some websites omit punctuation between adjacent sentences.
    # Add a boundary before common reporting/action verbs when a
    # new capitalized name appears after a likely sentence ending.
    repaired_sentences = []

    action_verbs = (
        r"said|reported|announced|confirmed|described|visited|"
        r"added|stated|claimed|explained|revealed|warned|"
        r"arrested|detained|criticised|criticized|condemned"
    )

    for sentence in sentences:
        sentence = sentence.strip()

        # Repair missing punctuation before a new named person
        # when the following words match a reporting/action pattern.
        sentence = re.sub(
            rf"(?<=[a-z])\s+"
            rf"(?=[A-Z][a-z]+(?:\s+[A-Z][a-z]+){{0,2}},?\s+"
            rf"(?:{action_verbs})\b)",
            ". ",
            sentence
        )

        # Also split when a new named person is followed by a
        # descriptive role and then a reporting/action verb.
        sentence = re.sub(
            r"(?<=[a-z])\s+(?=[A-Z][a-z]+\s+[A-Z][a-z]+,\s+"
            r"(?:deputy|chief|police|government|union)\b)",
            ". ",
            sentence
        )

        repaired_sentences.extend(
            part.strip()
            for part in re.split(r"(?<=[.!?])\s+", sentence)
            if part.strip()
        )


    # Candidate factual indicators.
    claim_patterns = [
        r"\bsaid\b",
        r"\bannounced\b",
        r"\breported\b",
        r"\bconfirmed\b",
        r"\bfound\b",
        r"\bdiscovered\b",
        r"\brevealed\b",
        r"\baccording to\b",
        r"\bdata shows\b",
        r"\bstudy found\b",
        r"\bresearch shows\b",
        r"\bcaused?\b",
        r"\bincreased\b",
        r"\bdecreased\b",
        r"\bpublished\b",
        r"\bapproved\b",
        r"\bwon\b",
        r"\boccurred\b",
        r"\bwas born\b",
        r"\bhas been\b",
        r"\bwere found\b",
        r"\bwas injured\b",
        r"\bwere injured\b",
        r"\barrested\b",
        r"\bdetained\b",
        r"\bvisited\b",
        r"\bsaid to\b",
    ]

    claims = []
    seen = set()

    def add_claim(sentence, method):
        sentence = sentence.strip(" \t\n-–")
        normalized = sentence.lower()

        if len(sentence) < 25 or normalized in seen:
            return

        # Ignore common navigation, timestamp, and category fragments.
        if re.fullmatch(
            r"[\d\s:.,-]*(?:mins?|hours?|days?) ago",
            sentence,
            flags=re.IGNORECASE
        ):
            return

        claims.append({
            "text": sentence,
            "status": "Needs verification",
            "method": method
        })
        seen.add(normalized)

    for sentence in repaired_sentences:
        if any(
            re.search(pattern, sentence, flags=re.IGNORECASE)
            for pattern in claim_patterns
        ):
            add_claim(sentence, "rule_based_candidate_extraction")

        if len(claims) >= 5:
            break

    # Fallback if no indicator patterns match.
    if not claims:
        for sentence in repaired_sentences:
            add_claim(sentence, "fallback_sentence_extraction")

            if len(claims) >= 5:
                break

    return claims



# ============================================================
# Evidence Analysis
# ============================================================

def analyze_evidence(content: str, claims):

    evidence_keywords = [
        "study",
        "research",
        "researchers",
        "data",
        "report",
        "according to",
        "official",
        "survey",
        "analysis",
        "evidence",
        "scientists",
        "experts",
        "university"
    ]

    content_lower = content.lower()

    matches = sum(
        1
        for keyword in evidence_keywords
        if keyword in content_lower
    )

    if matches >= 6:
        score = 23

    elif matches >= 4:
        score = 20

    elif matches >= 2:
        score = 17

    elif matches >= 1:
        score = 14

    else:
        score = 10

    return {
        "score": score,
        "max_score": 25,
        "evidence_indicators": matches
    }


# ============================================================
# Content Analysis
# ============================================================

def analyze_content(content: str):

    words = content.split()

    word_count = len(words)

    score = 12

    if word_count >= 300:
        score += 4

    elif word_count >= 150:
        score += 3

    elif word_count >= 75:
        score += 2

    if word_count < 30:
        score -= 3

    score = max(
        0,
        min(score, 20)
    )

    return {
        "score": score,
        "max_score": 20,
        "word_count": word_count
    }


# ============================================================
# Manipulation Analysis
# ============================================================

def analyze_manipulation(content: str):

    score = 15

    warnings = []

    # --------------------------------------------------------
    # Exclamation marks
    # --------------------------------------------------------

    exclamation_count = content.count("!")

    if exclamation_count >= 5:

        score -= 4

        warnings.append(
            "Frequent exclamation marks detected."
        )

    elif exclamation_count >= 3:

        score -= 2

    # --------------------------------------------------------
    # Question marks
    # --------------------------------------------------------

    question_count = content.count("?")

    if question_count >= 5:

        score -= 2

        warnings.append(
            "Frequent question marks detected."
        )

    # --------------------------------------------------------
    # ALL CAPS
    # --------------------------------------------------------

    caps_words = re.findall(
        r"\b[A-Z]{4,}\b",
        content
    )

    caps_count = len(caps_words)

    if caps_count >= 5:

        score -= 4

        warnings.append(
            "Frequent all-capital words detected."
        )

    elif caps_count >= 3:

        score -= 2

    # --------------------------------------------------------
    # Sensational language
    # --------------------------------------------------------

    sensational_words = [
        "shocking",
        "unbelievable",
        "breaking",
        "miracle",
        "secret",
        "exposed",
        "you won't believe",
        "must see",
        "urgent",
        "scandal"
    ]

    content_lower = content.lower()

    sensational_matches = [
        word
        for word in sensational_words
        if word in content_lower
    ]

    if sensational_matches:

        reduction = min(
            len(sensational_matches) * 2,
            5
        )

        score -= reduction

        warnings.append(
            "Sensational language detected."
        )

    score = max(
        0,
        min(score, 15)
    )

    return {
        "score": score,
        "max_score": 15,
        "warnings": warnings,
        "signals_detected": (
            exclamation_count
            + question_count
            + caps_count
            + len(sensational_matches)
        )
    }


# ============================================================
# Cross-Source Analysis
# ============================================================

def analyze_cross_source(content: str):

    return {
        "score": 10,
        "max_score": 20,
        "status": "Not externally verified",
        "description": (
            "Cross-source verification will be added "
            "in a later version."
        )
    }


# ============================================================
# Credibility Score
# ============================================================

def calculate_credibility_score(
    source_score,
    evidence_score,
    cross_source_score,
    content_score,
    manipulation_score
):

    total = (
        source_score
        + evidence_score
        + cross_source_score
        + content_score
        + manipulation_score
    )

    return max(
        0,
        min(total, 100)
    )


# ============================================================
# Score Label
# ============================================================

def get_label(score: int):

    if score >= 80:
        return "High credibility indicators"

    if score >= 60:
        return "Moderate credibility indicators"

    if score >= 40:
        return "Low credibility indicators"

    return "Very low credibility indicators"


# ============================================================
# MAIN ANALYSIS ENDPOINT
# ============================================================

@app.post("/analyze")
def analyze_news(request: NewsRequest):

    # --------------------------------------------------------
    # 1. Validate Input
    # --------------------------------------------------------

    if not request.content.strip():

        return {
            "status": "error",
            "message": "Article content cannot be empty."
        }

    # --------------------------------------------------------
    # 2. Preprocess
    # --------------------------------------------------------

    content = clean_text(
        request.content
    )

    
    # --------------------------------------------------------
    # 3. Claim Extraction
    # --------------------------------------------------------

# Keep the existing rule-based extraction as the baseline.
    claims = extract_claims(content)

    # Use NLP as an additional signal, not as the sole extractor.
    try:
        nlp_claims = classify_candidate_claims(content)

        existing_texts = {
            claim["text"].strip().casefold()
            for claim in claims
        }

        for claim in nlp_claims:
            claim_text = claim["text"].strip()
            normalized_text = claim_text.casefold()

            if normalized_text not in existing_texts:
                claims.append(claim)
                existing_texts.add(normalized_text)

            if len(claims) >= 5:
                break

    except Exception as exc:
        # Keep the existing analysis working if NLP fails.
        print(f"NLP claim classification failed: {exc}")

    # Preserve the existing maximum of five claims.
    claims = claims[:5]

    

    # --------------------------------------------------------
    # 4. Source Analysis
    # --------------------------------------------------------

    source = analyze_source(
        content,
        request.source_url
    )

    # --------------------------------------------------------
    # 5. Evidence Analysis
    # --------------------------------------------------------

    evidence = analyze_evidence(
        content,
        claims
    )

    # --------------------------------------------------------
    # 6. Content Analysis
    # --------------------------------------------------------

    content_analysis = analyze_content(
        content
    )

    # --------------------------------------------------------
    # 7. Manipulation Analysis
    # --------------------------------------------------------

    manipulation = analyze_manipulation(
        content
    )

    # --------------------------------------------------------
    # 8. Cross-Source Analysis
    # --------------------------------------------------------

    cross_source = analyze_cross_source(
        content
    )

    # --------------------------------------------------------
    # 9. Calculate Credibility Score
    # --------------------------------------------------------

    credibility_score = calculate_credibility_score(
        source["score"],
        evidence["score"],
        cross_source["score"],
        content_analysis["score"],
        manipulation["score"]
    )

    # --------------------------------------------------------
    # 10. Positive Indicators
    # --------------------------------------------------------

    positive_indicators = []

    if evidence["evidence_indicators"] >= 2:

        positive_indicators.append(
            "Evidence-related references were detected."
        )

    if manipulation["score"] >= 12:

        positive_indicators.append(
            "Limited obvious sensational language detected."
        )

    if source["domain"]:

        positive_indicators.append(
            f"Source domain detected: {source['domain']}"
        )

    if content_analysis["word_count"] >= 150:

        positive_indicators.append(
            "Article contains sufficient text for analysis."
        )

    # --------------------------------------------------------
    # 11. Warnings
    # --------------------------------------------------------

    warnings = manipulation["warnings"].copy()

    if not source["domain"]:

        warnings.append(
            "No article source domain was provided."
        )

    if cross_source["status"] == "Not externally verified":

        warnings.append(
            "Claims have not yet been verified against external sources."
        )

    if not claims:

        warnings.append(
            "No clear factual claims were extracted."
        )

    # --------------------------------------------------------
    # 12. Confidence
    # --------------------------------------------------------

    word_count = content_analysis["word_count"]

    if word_count >= 300:

        confidence = 80

    elif word_count >= 150:

        confidence = 72

    elif word_count >= 75:

        confidence = 64

    else:

        confidence = 50

    # --------------------------------------------------------
    # 13. Final Response
    # --------------------------------------------------------

    return {

        "status": "completed",

        "analysis_version": "baseline-v1",

        "article": content,

        "credibility_score": credibility_score,

        "label": get_label(
            credibility_score
        ),

        "confidence": confidence,

        "score_breakdown": {

            "source_credibility": {
                "score": source["score"],
                "max_score": source["max_score"]
            },

            "evidence_claims": {
                "score": evidence["score"],
                "max_score": evidence["max_score"]
            },

            "cross_source_agreement": {
                "score": cross_source["score"],
                "max_score": cross_source["max_score"]
            },

            "content_analysis": {
                "score": content_analysis["score"],
                "max_score": content_analysis["max_score"]
            },

            "manipulation_signals": {
                "score": manipulation["score"],
                "max_score": manipulation["max_score"]
            }
        },

        "claims": claims,

        "source": {

            "domain": source["domain"],

            "description": source["description"]

        },

        "positive_indicators": positive_indicators,

        "warnings": warnings,

        "verification": {

            "cross_source_status": cross_source["status"],

            "message": cross_source["description"]

        }
    }

# ============================================================
# URL Article Extraction
# ============================================================

MAX_HTML_BYTES = 5_000_000
FETCH_TIMEOUT_SECONDS = 12


def _validate_public_url(url: str) -> str:
    """Validate URL scheme and reject local/private network destinations."""
    try:
        parsed = urlparse(url.strip())
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            raise HTTPException(
                status_code=400,
                detail="Enter a valid HTTP or HTTPS article URL."
            )

        if parsed.username or parsed.password:
            raise HTTPException(
                status_code=400,
                detail="URLs containing username/password credentials are not allowed."
            )

        host = parsed.hostname.rstrip(".").lower()
        if host == "localhost" or host.endswith(".localhost") or host.endswith(".local"):
            raise HTTPException(
                status_code=400,
                detail="Local URLs cannot be analyzed."
            )

        try:
            literal_ip = ipaddress.ip_address(host)
            addresses = [literal_ip]
        except ValueError:
            try:
                addresses = [
                    ipaddress.ip_address(item[4][0])
                    for item in socket.getaddrinfo(
                        host,
                        parsed.port or (443 if parsed.scheme == "https" else 80),
                        type=socket.SOCK_STREAM,
                    )
                ]
            except OSError:
                raise HTTPException(
                    status_code=400,
                    detail="The URL hostname could not be resolved."
                )

        if not addresses or any(not address.is_global for address in addresses):
            raise HTTPException(
                status_code=400,
                detail="URLs pointing to private or local networks are not allowed."
            )

        return host

    except HTTPException:
        raise
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="The URL is invalid."
        )


def fetch_article_from_url(url: str) -> dict:
    """Fetch a public HTML page and extract its title and article text."""
    cleaned_url = url.strip()
    host = _validate_public_url(cleaned_url)

    try:
        with requests.get(
            cleaned_url,
            headers={
                "User-Agent": "NewsAI/1.0 (+article text extraction)",
                "Accept": "text/html,application/xhtml+xml",
            },
            timeout=FETCH_TIMEOUT_SECONDS,
            allow_redirects=False,
            stream=True,
        ) as response:
            if 300 <= response.status_code < 400:
                raise HTTPException(
                    status_code=400,
                    detail="This URL redirects. Please enter the final article URL."
                )

            response.raise_for_status()

            content_type = response.headers.get("Content-Type", "").lower()
            if "text/html" not in content_type and "application/xhtml+xml" not in content_type:
                raise HTTPException(
                    status_code=415,
                    detail="This link does not point to an HTML article page."
                )

            content_length = response.headers.get("Content-Length")
            if content_length:
                try:
                    if int(content_length) > MAX_HTML_BYTES:
                        raise HTTPException(
                            status_code=413,
                            detail="The webpage is too large to process."
                        )
                except ValueError:
                    pass

            html = response.raw.read(MAX_HTML_BYTES + 1, decode_content=True)
            if len(html) > MAX_HTML_BYTES:
                raise HTTPException(
                    status_code=413,
                    detail="The webpage is too large to process."
                )

        soup = BeautifulSoup(html, "html.parser")
        title_tag = soup.find("title")
        title = title_tag.get_text(" ", strip=True) if title_tag else ""

        # Prefer Open Graph metadata title if available.
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            title = og_title["content"].strip()

        for element in soup([
            "script", "style", "nav", "footer", "header",
            "aside", "form", "noscript", "svg"
        ]):
            element.decompose()

        article = soup.find("article") or soup.find("main")
        if article:
            text = article.get_text(" ", strip=True)
        else:
            paragraphs = soup.find_all("p")
            text = " ".join(p.get_text(" ", strip=True) for p in paragraphs)

        text = re.sub(r"\s+", " ", text).strip()

        if len(text) < 200:
            raise HTTPException(
                status_code=422,
                detail=(
                    "Not enough article text could be extracted. "
                    "The site may block automated access, require JavaScript, "
                    "or require a subscription."
                )
            )

        return {
            "title": title,
            "text": text,
            "domain": host.removeprefix("www."),
            "url": cleaned_url,
        }

    except HTTPException:
        raise
    except requests.Timeout:
        raise HTTPException(
            status_code=504,
            detail="The article website took too long to respond."
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="Could not retrieve this webpage. Try another article URL."
        )
    # ============================================================
# External Evidence Retrieval (Stage 1)
# ============================================================

import re
from urllib.parse import urlparse


def extract_article_text(url: str) -> dict:
    """Fetch an article and extract readable paragraph text."""
    try:
        response = requests.get(
            url,
            timeout=12,
            headers={"User-Agent": "Mozilla/5.0 (compatible; NewsAI/1.0)"},
            allow_redirects=True,
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        for element in soup.select(
            "script, style, nav, footer, header, aside, "
            "form, iframe, noscript"
        ):
            element.decompose()

        title_tag = soup.find("h1") or soup.find("title")
        title = title_tag.get_text(" ", strip=True) if title_tag else ""

        paragraphs = [
            p.get_text(" ", strip=True)
            for p in soup.find_all("p")
        ]

        article_text = " ".join(
            p for p in paragraphs if len(p) > 40
        )

        return {
            "final_url": response.url,
            "domain": (urlparse(response.url).hostname or "")
                .lower().removeprefix("www."),
            "title": title[:300],
            "text": article_text[:12000],
            "fetch_status": "success" if article_text else "no_article_text",
        }

    except requests.RequestException:
        return {
            "final_url": url,
            "domain": (urlparse(url).hostname or "")
                .lower().removeprefix("www."),
            "title": "",
            "text": "",
            "fetch_status": "fetch_failed",
        }


def assess_evidence(claim: str, article_text: str) -> dict:
    """
    Conservative, rule-based screening.
    This is not an AI fact-checker and cannot establish truth by itself.
    """
    if not article_text or len(article_text) < 100:
        return {
            "label": "Insufficient evidence",
            "reason": "Readable article text was unavailable.",
            "keyword_overlap": 0,
        }

    def tokens(text):
        words = re.findall(r"[a-z0-9]+", text.lower())
        stop_words = {
            "the", "a", "an", "is", "are", "was", "were", "be",
            "been", "being", "to", "of", "in", "on", "at", "by",
            "for", "and", "or", "that", "this", "with", "as",
            "it", "its", "they", "their", "he", "she", "said",
            "according", "people", "who", "which", "from", "after",
            "before", "into", "about", "has", "have", "had",
        }
        return {word for word in words if len(word) > 2
                and word not in stop_words}

    claim_words = tokens(claim)
    article_words = tokens(article_text)
    if not claim_words:
        return {
            "label": "Insufficient evidence",
            "reason": "Could not identify useful terms in the claim.",
            "keyword_overlap": 0,
        }

    matched = claim_words & article_words
    overlap = len(matched) / len(claim_words)

    numbers = re.findall(r"\b\d+\b", claim)
    numbers_match = all(
        number in re.findall(r"\b\d+\b", article_text)
        for number in numbers
    )

    # Only identify clear denial language as a contradiction candidate.
    denial_patterns = [
        r"\bpolice denied\b",
        r"\bpolice said no\b",
        r"\bno one was detained\b",
        r"\bno arrests were made\b",
        r"\bthe claim is false\b",
        r"\bfalsely claimed\b",
    ]
    explicit_denial = any(
        re.search(pattern, article_text, re.IGNORECASE)
        for pattern in denial_patterns
    )

    if explicit_denial and overlap >= 0.35:
        label = "Contradicts"
        reason = "Possible explicit denial detected; manual review is required."
    elif overlap >= 0.65 and numbers_match:
        label = "Supports"
        reason = (
            "Many claim terms and its numbers appear in the article. "
            "This is a relevance signal, not proof of confirmation."
        )
    else:
        label = "Insufficient evidence"
        reason = (
            "The extracted text does not match enough of the claim "
            "to make a reliable determination."
        )

    return {
        "label": label,
        "reason": reason,
        "keyword_overlap": round(overlap, 2),
    }

def assess_source_quality(article: dict) -> dict:
    """Estimate source usability, not the truth of a claim."""

    domain = article.get("domain", "")
    text = article.get("text", "").strip()
    title = article.get("title", "").strip()
    fetch_status = article.get("fetch_status", "")

    score = 0
    reasons = []

    if domain and domain != "publisher_unresolved":
        score += 30
        reasons.append("Publisher domain identified")
    else:
        reasons.append("Publisher identity unresolved")

    if fetch_status == "success" and len(text) >= 300:
        score += 40
        reasons.append("Readable article text retrieved")
    elif text:
        score += 20
        reasons.append("Only limited article text retrieved")
    else:
        reasons.append("No readable article text")

    if title and title.lower() != "google news":
        score += 15
        reasons.append("Article headline identified")

    if len(text) >= 1000:
        score += 15
        reasons.append("Substantial article text available")

    return {
        "quality_score": min(score, 100),
        "quality_reasons": reasons,
    }


def normalize_article_text(text: str) -> str:
    """Normalize text for simple duplicate detection."""
    import re

    text = text.lower()
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return " ".join(text.split())


def is_duplicate_article(article: dict, existing_articles: list) -> bool:
    """Detect same-domain duplicates and highly similar article text."""

    import re

    domain = article.get("publisher_domain", "")
    text = normalize_article_text(article.get("article_excerpt", ""))

    if not text:
        return False

    words = set(re.findall(r"\b[a-z0-9]{3,}\b", text))

    for existing in existing_articles:
        existing_domain = existing.get("publisher_domain", "")
        existing_text = normalize_article_text(
            existing.get("article_excerpt", "")
        )

        # Same publisher domain: don't count it twice.
        if domain and domain == existing_domain:
            return True

        existing_words = set(
            re.findall(r"\b[a-z0-9]{3,}\b", existing_text)
        )

        if not words or not existing_words:
            continue

        similarity = len(words & existing_words) / len(
            words | existing_words
        )

        # A conservative heuristic for near-identical article text.
        if similarity >= 0.80:
            return True

    return False



@app.post("/verify-claim")
def verify_claim(request: VerifyClaimRequest):
    claim = request.claim.strip()

    if len(claim) < 10:
        raise HTTPException(
            status_code=400,
            detail="Please provide a longer factual claim."
        )

    if len(claim) > 500:
        raise HTTPException(
            status_code=400,
            detail="Claim must be 500 characters or fewer."
        )

    search_url = (
        "https://news.google.com/rss/search?q="
        + quote_plus(claim)
        + "&hl=en-IN&gl=IN&ceid=IN:en"
    )

    try:
        response = requests.get(
            search_url,
            timeout=15,
            headers={"User-Agent": "Mozilla/5.0 NewsAI/1.0"}
        )
        response.raise_for_status()
        root = ET.fromstring(response.content)

    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="Could not reach the external news search."
        )
    except ET.ParseError:
        raise HTTPException(
            status_code=502,
            detail="The news search returned invalid RSS data."
        )

    original_domain = (
        request.source_domain or ""
    ).lower().removeprefix("www.")

    results = []
    seen_domains = set()
    duplicate_count = 0

    for item in root.findall("./channel/item"):
        title = item.findtext("title", default="").strip()
        link = item.findtext("link", default="").strip()
        published = item.findtext("pubDate", default="").strip()

        if not title or not link:
            continue

        # Resolve Google News URL to the publisher's URL.
        decoded_url = link

        try:
            decoded = gnewsdecoder(link, timeout=10)

            if (
                isinstance(decoded, dict)
                and decoded.get("success")
                and decoded.get("decoded_url")
            ):
                decoded_url = decoded["decoded_url"]

        except Exception as exc:
            print(f"Google News URL decoding failed: {exc}")

        # Retrieve the publisher article.
        article = extract_article_text(decoded_url)
        domain = article.get("domain", "")

        if not domain or domain == "news.google.com":
            source_element = item.find("source")
            source_url = (
                source_element.get("url", "")
                if source_element is not None
                else ""
            )

            rss_domain = (
                urlparse(source_url).hostname or ""
            ).lower().removeprefix("www.")

            domain = rss_domain or "publisher_unresolved"

        # Exclude the original publisher when its identity is known.
        if original_domain and domain != "publisher_unresolved":
            if (
                domain == original_domain
                or domain.endswith("." + original_domain)
            ):
                continue

        headline = article.get("title", "").strip()
        if not headline or headline.lower() == "google news":
            headline = title

        article_text = article.get("text", "")
        article_excerpt = article_text[:1500]

        result = {
            "title": headline,
            "publisher_domain": domain,
            "url": article.get("final_url", decoded_url),
            "published_at": published or None,
            "fetch_status": article.get("fetch_status", "fetch_failed"),
            "evidence_assessment": "Insufficient evidence",
            "assessment_reason": "Readable article text was unavailable.",
            "keyword_overlap": 0,
            "article_excerpt": article_excerpt,
            "source_quality_score": 0,
            "source_quality_reasons": [],
            "duplicate": False,
        }

        if article_text:
            assessment = assess_evidence(
                claim,
                headline + " " + article_text
            )
            result["evidence_assessment"] = assessment["label"]
            result["assessment_reason"] = assessment["reason"]
            result["keyword_overlap"] = assessment["keyword_overlap"]

        quality = assess_source_quality({
            "domain": domain,
            "text": article_text,
            "title": headline,
            "fetch_status": article.get(
                "fetch_status", "fetch_failed"
            ),
        })

        result["source_quality_score"] = quality["quality_score"]
        result["source_quality_reasons"] = quality["quality_reasons"]

        # Detect repeated publishers and highly similar article text.
        if is_duplicate_article(result, results):
            result["duplicate"] = True
            duplicate_count += 1

        results.append(result)

        if len(results) >= 10:
            break

    # Count only non-duplicate, identifiable publishers.
    unique_publishers = {
        item["publisher_domain"]
        for item in results
        if not item["duplicate"]
        and item["publisher_domain"] != "publisher_unresolved"
    }

    # Determine the overall result from readable, non-duplicate articles.
    usable_results = [
        item for item in results
        if not item["duplicate"]
        and item["fetch_status"] == "success"
        and item["source_quality_score"] >= 45
    ]

    labels = {
        item["evidence_assessment"]
        for item in usable_results
    }

    if "Supports" in labels and "Contradicts" in labels:
        overall = "Mixed"
    elif "Supports" in labels:
        overall = "Supports"
    elif "Contradicts" in labels:
        overall = "Contradicts"
    else:
        overall = "Insufficient evidence"

    return {
        "claim": claim,
        "overall_assessment": overall,
        "assessment_method": (
            "Rule-based keyword matching with duplicate detection "
            "and article usability scoring"
        ),
        "result_count": len(results),
        "unique_publishers_found": len(unique_publishers),
        "duplicate_articles_detected": duplicate_count,
        "usable_article_count": len(usable_results),
        "warning": (
            "Source quality measures article usability, not publisher "
            "trustworthiness. Duplicate detection is heuristic, and "
            "keyword matching does not establish truth. Syndicated "
            "articles may still appear independent. Review the evidence."
        ),
        "results": results,
    }




@app.post("/analyze-url")
def analyze_news_url(request: UrlRequest):
    page = fetch_article_from_url(request.url)

    # Reuse the existing analysis endpoint and provide the URL separately
    # so source scoring can use the publisher's domain.
    result = analyze_news(
        NewsRequest(content=page["text"], source_url=page["url"])
    )

    result["article"] = page["text"]
    result["article_title"] = page["title"]
    result["article_url"] = page["url"]
    result["source"] = {
        "domain": page["domain"],
        "description": (
            f"Article retrieved from {page['domain']}. "
            "Publisher reputation has not been independently verified."
        ),
    }

    return result
