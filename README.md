# Quoqo_assignment_option_A

## Seed Initial Data

Make sure MongoDB is running, then load demo tasks with:

```bash
npm run seed
```

This clears the existing task collection and inserts sample workflow tasks for testing.

## Run The App

Start the backend API:

```bash
npm start
```

Start the React UI in another terminal:

```bash
npm run client
```

Open the UI at:

```txt
http://localhost:5173
```

The frontend routes are:

```txt
/      task list dashboard
/new   create task form
```

You can also build the React UI and serve it from Express:

```bash
npm run build
npm start
```

Then open:

```txt
http://localhost:3000
```

## React Task List Component

The reusable React component is available at:

```txt
frontend/components/TaskList.jsx
```

It uses axios to call:

```txt
GET /tasks
PATCH /tasks/:id/status
```

Install axios in your React app:

```bash
npm install axios
```

For Vite, set the API URL in `.env` if your backend is not running on port 3000:

```txt
VITE_API_BASE_URL=http://localhost:3000
```
