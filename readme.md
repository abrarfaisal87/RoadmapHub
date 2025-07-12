

## 🚀 RoadmapHub – Feature Voting & Commenting App

This is a full-stack application where users can browse feature roadmap items, upvote them, and engage in a threaded comment system with replies, edit, and delete support.


---

## 📌 Thinking Process

Initially, the task seemed simple—implement upvotes and nested comments. But the complexity grew with each feature:

* **Threaded replies** with max depth (3 levels) required **recursive UI logic**
* **delete access control** required proper authentication and clean backend permission checks, didnt do edit since it was. 
* I refactored **multiple times** to ensure performance, clean data fetching, and code readability
* Mistakes like messy shared state between main comment & replies taught me the importance of **state isolation**

> Although it took longer than expected, I ensured each feature was functional and scalable before moving on to the next. I built everything **brick by brick** after learning the hard way that copy-pasting doesn’t scale.

---

## 🧠 Feature Design

### 🧾 User Authentication (JWT)

* Users can register and login. JWT tokens are stored in localStorage and passed in request headers.
* `POST /api/auth/signup`, `POST /api/auth/login`

### 📜 Roadmap Feature Items

* Roadmap items are fetched from the backend.
* Users can upvote each item only once. Toggle logic updates the vote count live.

### 🔼 Upvote System

* Backend tracks whether a user has already upvoted.
* The frontend uses local state to optimistically update the count.
* Trade-off: Vote status is not persisted in local UI cache, so refresh resets toggle.

### 💬 Nested Comments with Replies

* Comments are threaded up to 3 levels using **recursive tree building**.
* Each comment can be replied to, edited (if you are the owner), or deleted.
* UI dynamically renders **nested replies** with proper indentation.

### ✏️  Delete

* Only the owner of a comment can  delete it.


---

## 🏗️ Architecture Decisions

### ⚙️ Backend – Express + PostgreSQL (Supabase)

* Chosen for its speed, simplicity, and full SQL access.
* **PostgreSQL** is relational and excellent for nested data (e.g., comments with parent-child relationships).
* **Supabase** was used to host the PostgreSQL instance (free, easy setup).
* Authentication is handled using **JWT**, with middleware protecting routes.

### 🖥️ Frontend – React + Vite

* **React** offers component-level state and powerful composition—perfect for recursive nested comments.
* **Vite** was chosen over Create React App due to faster dev builds and modern setup.
* Styling was done using **TailwindCSS** for rapid UI layout.

---

## 🧹 Code Style & Patterns

### ✅ RESTful API Design

* The backend follows REST conventions with routes like:

  * `POST /api/comments/:roadmapId` (new comment)
  * `PUT /api/comments/:commentId` (edit comment)
  * `DELETE /api/comments/:commentId`

### ✅ Component Structure

* The main UI lives in `Roadmap.jsx`
* `Nav.jsx` is extracted as a shared component

### ✅ Naming Conventions

* Consistent camelCase for JS
* RESTful naming for routes
* Modular logic: `renderComments()` is a separate recursive function for clean mapping

### ✅ Secure Practices

* JWT tokens are verified on protected endpoints
* Sensitive data is handled through `.env` with `dotenv`

---

## 🔧 Backend Scripts

Make sure to run:

```bash
# Root
npm install
npm run dev
```

## 🧪 Frontend Scripts

```bash
# client/
cd client
npm install
npm run dev
```

---

## 🧠 What I Learned

* **Never skip step-by-step development**
* How to build **recursive UIs** in React cleanly.
* How to structure **PostgreSQL relations** for threaded comments.
* How to debug hard problems with **state isolation** and clear architectural thinking.

---

## 📂 Folder Structure

```
root/
│
├── client/         # React frontend (Vite)
├── Server/         # Express backend (API)
├── .env            # Env vars (ignored in Git)
├── vercel.json     # For backend deployment on Vercel
└── package.json    # Combined package.json for server scripts
```

---

## 🚧 To Do / Deployment Notes

* ✅ Backend: Built and working locally on port 3434
* 🧩 Frontend: Fully functional on Vite with dynamic comment system



---


---


