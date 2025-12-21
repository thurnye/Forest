# SPEC-B: Reading Forest API Reference

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Base URL:** `https://api.readingforest.app` (Production) | `http://localhost:8000` (Development)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Story Management](#story-management-endpoints)
   - [Student Journey](#student-journey-endpoints)
   - [Reading Circles](#reading-circles-endpoints)
   - [Teacher Portal](#teacher-portal-endpoints)
   - [Parent Portal](#parent-portal-endpoints)
   - [Admin Dashboard](#admin-dashboard-endpoints)
   - [System Health](#system-health-endpoints)

---

## Overview

Reading Forest provides a **thin Experience API layer** over an adaptive literacy learning system. The backend is **stateless** for horizontal scaling, with all ephemeral state managed in Redis (sessions, rate limits, WebSocket rooms) and permanent data in PostgreSQL.

### Key Characteristics

- **RESTful Design:** Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Payloads:** All requests and responses use JSON
- **JWT Authentication:** Stateless token-based auth
- **In-Memory Sessions:** Redis-backed with TTL expiry (24 hours)
- **Idempotent Operations:** Support for idempotency keys on write operations
- **WebSocket Support:** Real-time reading circles via WS protocol

---

## Authentication

### Authentication Flow

```
1. User logs in → POST /api/auth/login
2. Server returns { access_token, refresh_token }
3. Client includes token in headers: Authorization: Bearer <access_token>
4. Token expires after 24 hours of inactivity
5. Client refreshes → POST /api/auth/refresh
```

### Token Format

**Access Token (JWT):**

```json
{
  "sub": "user_id",
  "username": "studentUsername",
  "role": "student",
  "exp": 1640000000,
  "jti": "unique-token-id"
}
```

**Refresh Token:** Opaque string, stored in Redis with 7-day TTL

### Required Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Response Format

All API endpoints return responses in a consistent wrapper format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning               | When Used                      |
| ---- | --------------------- | ------------------------------ |
| 200  | OK                    | Successful GET/PUT request     |
| 201  | Created               | Successful POST request        |
| 204  | No Content            | Successful DELETE request      |
| 400  | Bad Request           | Invalid input/validation error |
| 401  | Unauthorized          | Missing or invalid token       |
| 403  | Forbidden             | Insufficient permissions       |
| 404  | Not Found             | Resource does not exist        |
| 409  | Conflict              | Resource already exists        |
| 422  | Unprocessable Entity  | Semantic validation error      |
| 429  | Too Many Requests     | Rate limit exceeded            |
| 500  | Internal Server Error | Server-side error              |
| 503  | Service Unavailable   | Temporary outage               |

### Error Codes

| Code                   | Description               |
| ---------------------- | ------------------------- |
| `VALIDATION_ERROR`     | Input validation failed   |
| `AUTHENTICATION_ERROR` | Login credentials invalid |
| `AUTHORIZATION_ERROR`  | Insufficient permissions  |
| `NOT_FOUND`            | Resource not found        |
| `DUPLICATE_ERROR`      | Resource already exists   |
| `RATE_LIMIT_ERROR`     | Too many requests         |
| `SERVER_ERROR`         | Internal server error     |

---

## API Endpoints

---

## Authentication Endpoints

### POST /api/auth/register

**Purpose:** Register a new user account

**Request Body:**

```json
{
  "username": "studentUsername",
  "password": "SecurePass123!",
  "name": "Jane Doe",
  "role": "student",
  "grade": 3,
  "district_id": 1,
  "school_id": 5,
  "class_id": 12
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "username": "studentUsername",
      "name": "Jane Doe",
      "role": "student",
      "grade": 3,
      "created_at": "2024-12-15T10:30:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "8f4b2c1e-3d5a-4f6b-9c8e-7a1b2c3d4e5f",
    "expires_in": 86400
  },
  "message": "Account created successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "password",
        "issue": "Password must be at least 8 characters"
      }
    ]
  }
}
```

---

### POST /api/auth/login

**Purpose:** Authenticate user and receive tokens

**Request Body:**

```json
{
  "username": "studentUsername",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "username": "studentUsername",
      "name": "Jane Doe",
      "role": "student"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "8f4b2c1e-3d5a-4f6b-9c8e-7a1b2c3d4e5f",
    "expires_in": 86400
  },
  "message": "Login successful"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid email or password"
  }
}
```

---

### POST /api/auth/refresh

**Purpose:** Refresh access token using refresh token

**Request Body:**

```json
{
  "refresh_token": "8f4b2c1e-3d5a-4f6b-9c8e-7a1b2c3d4e5f"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  },
  "message": "Token refreshed"
}
```

---

### POST /api/auth/logout

**Purpose:** Invalidate current session

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /api/auth/password-reset/request

**Purpose:** Request password reset email

**Request Body:**

```json
{
  "email": "student@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### POST /api/auth/password-reset/confirm

**Purpose:** Reset password with token from email

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Story Management Endpoints

### GET /api/stories

**Purpose:** Get list of available stories with filtering

**Query Parameters:**

- `level` (float, optional): Filter by reading level (e.g., 2.5)
- `culture` (string, optional): Filter by culture (e.g., "african", "asian")
- `language` (string, optional): Filter by language (e.g., "en", "es")
- `genre` (string, optional): Filter by genre (e.g., "fable", "myth")
- `page` (int, optional): Page number (default: 1)
- `per_page` (int, optional): Items per page (default: 20)

**Example Request:**

```
GET /api/stories?level=2.5&culture=african&page=1&per_page=10
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": 15,
        "title": "Anansi and the Wisdom",
        "author": "Traditional",
        "reading_level": 2.5,
        "lexile_score": 450,
        "culture": "african",
        "language": "en",
        "is_bilingual": false,
        "genre": "fable",
        "cover_image_url": "https://cdn.readingforest.app/covers/anansi.jpg",
        "page_count": 8,
        "word_count": 320,
        "themes": ["wisdom", "humility", "community"]
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 47,
      "total_pages": 5
    }
  }
}
```

---

### GET /api/stories/{story_id}

**Purpose:** Get detailed story information including pages, vocabulary, and questions

**Path Parameters:**

- `story_id` (int): Story identifier

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "story": {
      "id": 15,
      "title": "Anansi and the Wisdom",
      "author": "Traditional",
      "description": "A West African folktale about...",
      "reading_level": 2.5,
      "lexile_score": 450,
      "culture": "african",
      "moral": "True wisdom comes from sharing knowledge",
      "language": "en",
      "is_bilingual": false,
      "page_count": 8
    },
    "pages": [
      {
        "page_number": 1,
        "text": "Long ago, Anansi the spider wanted all the wisdom in the world...",
        "image_url": "https://cdn.readingforest.app/stories/15/page1.jpg",
        "audio_url": "https://cdn.readingforest.app/stories/15/page1.mp3"
      }
    ],
    "vocabulary": [
      {
        "id": 201,
        "word": "wisdom",
        "definition": "Knowledge and good judgment about what is true or right",
        "pronunciation": "WIZ-duhm",
        "example_sentence": "The elder shared his wisdom with the village.",
        "image_url": "https://cdn.readingforest.app/vocab/wisdom.jpg",
        "audio_url": "https://cdn.readingforest.app/vocab/wisdom.mp3"
      }
    ],
    "questions": [
      {
        "id": 501,
        "question_type": "comprehension",
        "question": "Why did Anansi want to collect all the wisdom?",
        "options": [
          "To become the wisest creature",
          "To share it with everyone",
          "To sell it for money",
          "To hide it from others"
        ],
        "correct_answer": "To become the wisest creature",
        "skill_code": "comprehension_main_idea",
        "difficulty": 0.6
      }
    ]
  }
}
```

---

### POST /api/stories/{story_id}/check-answer

**Purpose:** Verify comprehension question answer

**Path Parameters:**

- `story_id` (int): Story identifier

**Request Body:**

```json
{
  "question_id": 501,
  "answer": "To become the wisest creature"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "is_correct": true,
    "explanation": "Correct! Anansi wanted to be the wisest by collecting all wisdom for himself.",
    "skill_gained": "comprehension_main_idea",
    "xp_earned": 10
  }
}
```

---

### GET /api/stories/recommendations

**Purpose:** Get personalized story recommendations for current user

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": 23,
        "title": "The Clever Rabbit",
        "match_score": 0.92,
        "reason": "Great for practicing blends and comprehension",
        "reading_level": 2.3,
        "cover_image_url": "https://cdn.readingforest.app/covers/rabbit.jpg"
      },
      {
        "id": 45,
        "title": "Journey to the Moon",
        "match_score": 0.88,
        "reason": "Aligns with your interest in space stories",
        "reading_level": 2.4,
        "cover_image_url": "https://cdn.readingforest.app/covers/moon.jpg"
      }
    ],
    "daily_pick": {
      "id": 23,
      "title": "The Clever Rabbit",
      "description": "Perfect for today's practice!"
    }
  }
}
```

---

## Student Journey Endpoints

### GET /api/journey/dashboard

**Purpose:** Get student's reading dashboard with key metrics

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "name": "Jane Doe",
      "avatar_url": "https://cdn.readingforest.app/avatars/42.jpg"
    },
    "stats": {
      "reading_level": 2.5,
      "total_stories_read": 47,
      "total_words_read": 15420,
      "current_streak": 12,
      "longest_streak": 18,
      "xp_total": 3450,
      "badges_earned": 8
    },
    "current_goals": [
      {
        "id": 101,
        "title": "Read 50 stories",
        "progress": 47,
        "target": 50,
        "progress_percent": 94
      }
    ],
    "recent_achievements": [
      {
        "id": 5,
        "name": "Week Warrior",
        "description": "Read 7 days in a row",
        "icon_url": "https://cdn.readingforest.app/badges/week-warrior.png",
        "earned_at": "2024-12-10T15:30:00Z"
      }
    ]
  }
}
```

---

### GET /api/journey/timeline

**Purpose:** Get chronological reading activity timeline

**Query Parameters:**

- `limit` (int, optional): Number of items (default: 30)
- `offset` (int, optional): Skip items (default: 0)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "id": 1205,
        "activity_type": "read",
        "title": "Completed 'Anansi and the Wisdom'",
        "wcpm": 85,
        "accuracy": 0.92,
        "expression": 0.88,
        "timestamp": "2024-12-15T09:30:00Z",
        "story": {
          "id": 15,
          "title": "Anansi and the Wisdom",
          "cover_image_url": "https://cdn.readingforest.app/covers/anansi.jpg"
        }
      },
      {
        "id": 1204,
        "activity_type": "badge",
        "title": "Earned 'Speed Reader' badge",
        "badge": {
          "name": "Speed Reader",
          "icon_url": "https://cdn.readingforest.app/badges/speed-reader.png"
        },
        "timestamp": "2024-12-14T16:20:00Z"
      },
      {
        "id": 1203,
        "activity_type": "reflection",
        "title": "Reflection on 'The Clever Rabbit'",
        "mood": "happy",
        "text": "I loved how the rabbit outsmarted the lion!",
        "audio_url": "https://cdn.readingforest.app/reflections/1203.mp3",
        "timestamp": "2024-12-13T14:15:00Z"
      }
    ],
    "pagination": {
      "limit": 30,
      "offset": 0,
      "total": 156
    }
  }
}
```

---

### GET /api/journey/skills

**Purpose:** Get detailed skill mastery breakdown

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "skill_code": "phonics_cvc",
        "skill_name": "CVC Words",
        "category": "phonics",
        "mastery_level": 0.85,
        "total_attempts": 45,
        "correct_attempts": 39,
        "last_practiced": "2024-12-14T10:00:00Z",
        "status": "proficient"
      },
      {
        "skill_code": "phonics_blends",
        "skill_name": "Consonant Blends",
        "category": "phonics",
        "mastery_level": 0.62,
        "total_attempts": 28,
        "correct_attempts": 18,
        "last_practiced": "2024-12-13T14:30:00Z",
        "status": "developing"
      },
      {
        "skill_code": "comprehension_main_idea",
        "skill_name": "Identifying Main Idea",
        "category": "comprehension",
        "mastery_level": 0.78,
        "total_attempts": 32,
        "correct_attempts": 25,
        "last_practiced": "2024-12-15T09:45:00Z",
        "status": "proficient"
      }
    ],
    "summary": {
      "overall_mastery": 0.72,
      "skills_proficient": 15,
      "skills_developing": 8,
      "skills_emerging": 3
    }
  }
}
```

---

### POST /api/journey/session/start

**Purpose:** Start a new reading session

**Request Body:**

```json
{
  "story_id": 15
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "session_id": 5042,
    "story": {
      "id": 15,
      "title": "Anansi and the Wisdom",
      "page_count": 8
    },
    "started_at": "2024-12-15T10:00:00Z"
  },
  "message": "Reading session started"
}
```

---

### POST /api/journey/session/{session_id}/update

**Purpose:** Update session progress (pages read, fluency data)

**Path Parameters:**

- `session_id` (int): Session identifier

**Request Body:**

```json
{
  "pages_read": 3,
  "words_per_minute": 82.5,
  "fluency_data": {
    "accuracy": 0.91,
    "expression": 0.85,
    "pacing": 0.88
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "session_id": 5042,
    "pages_read": 3,
    "total_pages": 8,
    "progress_percent": 37.5
  },
  "message": "Session updated"
}
```

---

### POST /api/journey/session/{session_id}/end

**Purpose:** Complete reading session and calculate final scores

**Path Parameters:**

- `session_id` (int): Session identifier

**Request Body:**

```json
{
  "comprehension_score": 0.85,
  "fluency_score": 0.88
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "session_id": 5042,
    "final_scores": {
      "wcpm": 85,
      "accuracy": 0.92,
      "expression": 0.88,
      "comprehension": 0.85,
      "overall": 0.87
    },
    "xp_earned": 50,
    "new_badges": [
      {
        "id": 12,
        "name": "Fluency Master",
        "icon_url": "https://cdn.readingforest.app/badges/fluency-master.png"
      }
    ],
    "streak_updated": {
      "current": 13,
      "longest": 18
    },
    "next_recommendation": {
      "id": 23,
      "title": "The Clever Rabbit"
    }
  },
  "message": "Great job! Session complete."
}
```

---

### POST /api/journey/reflection

**Purpose:** Add text or voice reflection after reading

**Request Body:**

```json
{
  "story_id": 15,
  "mood": "happy",
  "text": "I loved this story! The spider was so clever.",
  "audio_url": "https://cdn.readingforest.app/reflections/upload-url"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "reflection_id": 892,
    "created_at": "2024-12-15T10:30:00Z"
  },
  "message": "Reflection saved"
}
```

---

## Reading Circles Endpoints

### POST /api/circles/create

**Purpose:** Create a new reading circle room (teacher only)

**Request Body:**

```json
{
  "name": "Grade 3 Reading Circle",
  "story_id": 15,
  "max_participants": 10,
  "settings": {
    "turn_duration_seconds": 120,
    "allow_emoji": true,
    "auto_advance_pages": false
  }
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "room_id": "rc_8f4b2c1e",
    "name": "Grade 3 Reading Circle",
    "join_url": "https://app.readingforest.com/circles/rc_8f4b2c1e",
    "created_at": "2024-12-15T10:00:00Z",
    "expires_at": "2024-12-15T11:00:00Z"
  },
  "message": "Reading circle created"
}
```

---

### GET /api/circles/{room_id}

**Purpose:** Get reading circle room details

**Path Parameters:**

- `room_id` (string): Room identifier

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "room_id": "rc_8f4b2c1e",
    "name": "Grade 3 Reading Circle",
    "status": "active",
    "story": {
      "id": 15,
      "title": "Anansi and the Wisdom"
    },
    "host": {
      "id": 10,
      "name": "Ms. Smith"
    },
    "participants": [
      {
        "user_id": 42,
        "name": "Jane",
        "role": "student",
        "points": 25
      },
      {
        "user_id": 43,
        "name": "John",
        "role": "student",
        "points": 20
      }
    ],
    "current_page": 3,
    "current_reader": 42,
    "created_at": "2024-12-15T10:00:00Z"
  }
}
```

---

### WebSocket: /ws/circles/{room_id}

**Purpose:** Real-time reading circle communication

**Connection:**

```javascript
const ws = new WebSocket(
  'wss://api.readingforest.app/ws/circles/rc_8f4b2c1e?token=<jwt_token>'
);
```

**Message Types:**

**1. Join Room**

```json
{
  "type": "join",
  "user_id": 42,
  "name": "Jane",
  "role": "student"
}
```

**2. Start Reading**

```json
{
  "type": "start_reading",
  "reader_id": 42
}
```

**3. Page Turn**

```json
{
  "type": "page_turn",
  "page_number": 4
}
```

**4. Post MCQ**

```json
{
  "type": "mcq",
  "question": "What did Anansi learn?",
  "options": ["A", "B", "C", "D"],
  "correct": "A",
  "duration_seconds": 30
}
```

**5. Submit Answer**

```json
{
  "type": "answer",
  "user_id": 42,
  "answer": "A"
}
```

**6. Send Emoji**

```json
{
  "type": "emoji",
  "user_id": 42,
  "emoji": "👍"
}
```

**7. End Session**

```json
{
  "type": "end_session"
}
```

**Broadcast Messages:**

```json
{
  "type": "user_joined",
  "user": { "id": 42, "name": "Jane" },
  "timestamp": "2024-12-15T10:05:00Z"
}
```

```json
{
  "type": "reading_started",
  "reader": { "id": 42, "name": "Jane" },
  "timestamp": "2024-12-15T10:06:00Z"
}
```

```json
{
  "type": "scores_updated",
  "scores": [
    { "user_id": 42, "points": 30 },
    { "user_id": 43, "points": 25 }
  ]
}
```

---

### POST /api/circles/{room_id}/export

**Purpose:** Export reading circle transcript to PDF

**Path Parameters:**

- `room_id` (string): Room identifier

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "pdf_url": "https://cdn.readingforest.app/transcripts/rc_8f4b2c1e.pdf",
    "expires_at": "2024-12-22T10:00:00Z"
  },
  "message": "Transcript generated"
}
```

---

## Teacher Portal Endpoints

### GET /api/teacher/students

**Purpose:** Get list of students in teacher's class(es)

**Query Parameters:**

- `class_id` (int, optional): Filter by specific class
- `grade` (int, optional): Filter by grade level

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": 42,
        "name": "Jane Doe",
        "email": "jane@school.edu",
        "grade": 3,
        "class_id": 12,
        "reading_level": 2.5,
        "current_streak": 12,
        "last_active": "2024-12-15T09:30:00Z",
        "at_risk": false
      },
      {
        "id": 43,
        "name": "John Smith",
        "email": "john@school.edu",
        "grade": 3,
        "class_id": 12,
        "reading_level": 1.8,
        "current_streak": 0,
        "last_active": "2024-12-10T14:20:00Z",
        "at_risk": true
      }
    ]
  }
}
```

---

### GET /api/teacher/feed

**Purpose:** Get recent activity feed for all students in class

**Query Parameters:**

- `class_id` (int): Class identifier
- `limit` (int, optional): Number of items (default: 50)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "feed": [
      {
        "id": 3041,
        "student": {
          "id": 42,
          "name": "Jane Doe"
        },
        "activity_type": "story_completed",
        "story_title": "Anansi and the Wisdom",
        "wcpm": 85,
        "accuracy": 0.92,
        "timestamp": "2024-12-15T09:30:00Z"
      },
      {
        "id": 3040,
        "student": {
          "id": 43,
          "name": "John Smith"
        },
        "activity_type": "badge_earned",
        "badge_name": "Week Warrior",
        "timestamp": "2024-12-14T16:20:00Z"
      }
    ]
  }
}
```

---

### GET /api/teacher/alerts

**Purpose:** Get intervention alerts for at-risk students

**Query Parameters:**

- `class_id` (int, optional): Filter by class
- `priority` (string, optional): Filter by priority ("high", "medium")

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": 150,
        "student": {
          "id": 43,
          "name": "John Smith"
        },
        "priority": "high",
        "type": "fluency_decline",
        "message": "WCPM decreased by 15% over last 2 weeks",
        "recommendation": "Schedule 1-on-1 reading session",
        "created_at": "2024-12-14T08:00:00Z"
      },
      {
        "id": 151,
        "student": {
          "id": 45,
          "name": "Sarah Johnson"
        },
        "priority": "medium",
        "type": "low_engagement",
        "message": "No reading activity in 5 days",
        "recommendation": "Send reminder to parent",
        "created_at": "2024-12-13T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /api/teacher/assign-story

**Purpose:** Assign a story to student(s)

**Request Body:**

```json
{
  "student_ids": [42, 43, 44],
  "story_id": 15,
  "due_date": "2024-12-20T23:59:59Z"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "assignment_id": 890,
    "students_assigned": 3
  },
  "message": "Story assigned successfully"
}
```

---

## Parent Portal Endpoints

### POST /api/parent/link-child

**Purpose:** Link parent account to child account

**Request Body:**

```json
{
  "child_email": "jane@school.edu",
  "verification_code": "ABC123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "child": {
      "id": 42,
      "name": "Jane Doe",
      "grade": 3
    }
  },
  "message": "Child account linked"
}
```

---

### GET /api/parent/children

**Purpose:** Get list of linked children

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "children": [
      {
        "id": 42,
        "name": "Jane Doe",
        "grade": 3,
        "school": "Lincoln Elementary",
        "reading_level": 2.5,
        "current_streak": 12
      }
    ]
  }
}
```

---

### GET /api/parent/child/{child_id}/progress

**Purpose:** View child's reading progress

**Path Parameters:**

- `child_id` (int): Child user ID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "child": {
      "id": 42,
      "name": "Jane Doe"
    },
    "stats": {
      "reading_level": 2.5,
      "total_stories_read": 47,
      "current_streak": 12,
      "avg_wcpm": 85,
      "avg_accuracy": 0.91
    },
    "recent_activity": [
      {
        "date": "2024-12-15",
        "stories_read": 2,
        "minutes_read": 25
      }
    ],
    "skill_progress": [
      {
        "skill_name": "CVC Words",
        "mastery_level": 0.85,
        "status": "proficient"
      }
    ]
  }
}
```

---

### GET /api/parent/home-reading-pack

**Purpose:** Download printable home reading activities

**Query Parameters:**

- `child_id` (int): Child user ID
- `week` (string): Week identifier (e.g., "2024-W50")

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "pdf_url": "https://cdn.readingforest.app/home-packs/child42-week50.pdf",
    "activities": [
      {
        "title": "Word Family Practice",
        "description": "Practice -at words: cat, hat, mat"
      },
      {
        "title": "Story Discussion",
        "description": "Talk about 'Anansi and the Wisdom'"
      }
    ]
  }
}
```

---

## Admin Dashboard Endpoints

### GET /api/admin/metrics/overview

**Purpose:** Get district-wide KPIs and metrics

**Query Parameters:**

- `district_id` (int, optional): Filter by district
- `school_id` (int, optional): Filter by school
- `date_from` (string, optional): Start date (ISO 8601)
- `date_to` (string, optional): End date (ISO 8601)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "kpis": {
      "total_students": 1500,
      "active_students_today": 450,
      "avg_wcpm_growth": 8.5,
      "completion_rate": 0.87,
      "at_risk_count": 45
    },
    "trends": {
      "wcpm_over_time": [
        { "date": "2024-12-01", "avg_wcpm": 75 },
        { "date": "2024-12-08", "avg_wcpm": 78 },
        { "date": "2024-12-15", "avg_wcpm": 82 }
      ],
      "engagement_by_day": [
        { "day": "Monday", "active_count": 420 },
        { "day": "Tuesday", "active_count": 450 },
        { "day": "Wednesday", "active_count": 430 }
      ]
    }
  }
}
```

---

### GET /api/admin/cohorts

**Purpose:** Get list of cohorts (classes/groups)

**Query Parameters:**

- `district_id` (int, optional): Filter by district
- `school_id` (int, optional): Filter by school

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "cohorts": [
      {
        "id": 12,
        "name": "Mrs. Smith - Grade 3A",
        "school": "Lincoln Elementary",
        "grade": 3,
        "student_count": 25,
        "avg_reading_level": 2.8,
        "teacher": {
          "id": 10,
          "name": "Ms. Smith"
        }
      }
    ]
  }
}
```

---

### POST /api/admin/export

**Purpose:** Export data in various formats

**Request Body:**

```json
{
  "export_type": "student_progress",
  "format": "csv",
  "filters": {
    "school_id": 5,
    "grade": 3,
    "date_from": "2024-12-01",
    "date_to": "2024-12-15"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "download_url": "https://cdn.readingforest.app/exports/progress-20241215.csv",
    "expires_at": "2024-12-22T10:00:00Z",
    "record_count": 450
  },
  "message": "Export ready for download"
}
```

---

### POST /api/admin/goals/set

**Purpose:** Set reading goals for cohorts

**Request Body:**

```json
{
  "cohort_id": 12,
  "goal_type": "wcpm_improvement",
  "target_value": 10.0,
  "deadline": "2024-12-31T23:59:59Z"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "goal_id": 305,
    "cohort_id": 12,
    "current_value": 5.2,
    "target_value": 10.0,
    "progress_percent": 52
  },
  "message": "Goal set successfully"
}
```

---

## System Health Endpoints

### GET /health

**Purpose:** Basic health check (no auth required)

**Success Response (200):**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production"
}
```

---

### GET /api/health/detailed

**Purpose:** Detailed system health (admin only)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": {
        "status": "up",
        "latency_ms": 12
      },
      "redis": {
        "status": "up",
        "latency_ms": 3
      },
      "storage": {
        "status": "up"
      }
    },
    "system": {
      "cpu_percent": 45.2,
      "memory_percent": 62.8,
      "uptime_seconds": 3456789
    }
  }
}
```

---

## Common Response Wrapper

All endpoints use a consistent wrapper format for standardization and easier client-side handling.

### Success Wrapper

```json
{
  "success": true,
  "data": {
    // Endpoint-specific payload
  },
  "message": "Optional success message",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Error Wrapper

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      // Optional array of detailed error info
    ]
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Pagination Wrapper

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## Rate Limiting

All authenticated endpoints are rate-limited:

- **Default:** 100 requests/minute per user
- **Auth endpoints:** 10 requests/minute per IP
- **WebSocket:** 1 connection per user per room

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1640000000
```

**Rate Limit Exceeded (429):**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_ERROR",
    "message": "Too many requests. Please try again in 32 seconds."
  }
}
```

---

## Idempotency

Write operations support idempotency keys to prevent duplicate processing:

**Request Header:**

```
Idempotency-Key: 8f4b2c1e-3d5a-4f6b-9c8e-7a1b2c3d4e5f
```

If the same key is used within 24 hours, the cached result is returned instead of reprocessing.

---

## Summary

The Reading Forest API provides a **clean, RESTful interface** with:

1. **Consistent response format** across all endpoints
2. **JWT authentication** for stateless scaling
3. **In-memory sessions** with TTL expiry in Redis
4. **WebSocket support** for real-time reading circles
5. **Comprehensive error handling** with clear codes
6. **Rate limiting** to prevent abuse
7. **Idempotency support** for write operations
8. **Pagination** for large datasets

All data lives in **PostgreSQL** (permanent) or **Redis** (ephemeral with TTL), enabling horizontal scaling and high availability.

---

**For detailed architecture information, see [SPEC-A: Architecture](./SPEC-A-architecture.md)**
