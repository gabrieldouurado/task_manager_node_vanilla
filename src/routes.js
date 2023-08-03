import { randomUUID } from "crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const search = req.query ?? null

      const tasks = database.select('tasks', search)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ error: "Missing title or description!" }))
      }

      const user = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      database.insert('tasks', user)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.findById('tasks', id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ error: "Task not found!" }))
      }

      if (title) {
        Object.assign(task, {
          ...task,
          title
        })
      }

      if (description) {
        Object.assign(task, {
          ...task,
          description
        })
      }

      database.update('tasks', id, {
        ...task,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.findById('tasks', id)
      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ error: "Task not found!" }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.findById('tasks', id)
      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ error: "Task not found!" }))
      }

      let taskCompleted = task.completed_at ? null : new Date()

      database.update('tasks', id, {
        ...task,
        completed_at: taskCompleted
      })

      return res.writeHead(204).end()
    }
  },
]