import {randomUUID} from 'node:crypto'
import { Database} from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),

    handler: (req, res)=>{
      const {title, description} = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res)=>{
      const {search} = req.query;


      const task = search ? {
        title: search,
        description: search
      } : null;

      const tasks = database.select('tasks', task);

      return res.end(JSON.stringify(tasks))
    }
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res)=>{
      const {id} = req.params;

      const {title, description} = req.body;

      if(!title || !description){
        return res.writeHead(400).end(
          JSON.stringify({message: 'Title ou descrição são necessários!'})
        );
      }

      const searchTask = {
        id
      }

      const task = database.select("tasks", searchTask);

      if(task.length===0){
        return res.writeHead(404).end(JSON.stringify({message: "Task not found!"}));
      }

      const data = {
        title,
        description,
        updated_at: new Date(),
      }

      database.update("tasks", data, id);
      return res.writeHead(204).end()
    }
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res)=>{
      const {id} = req.params

      const searchTask = {
        id
      }

      const task = database.select("tasks", searchTask);

      if(task.length===0){
        return res.writeHead(404).end(JSON.stringify({message: "Task not found!"}));
      }

      database.delete("tasks", id);
      return res.writeHead(204).end()
    }
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res)=>{
      const {id} = req.params;

      const searchTask = {
        id
      }

      const [task] = database.select("tasks", searchTask);
    
      if(!task){
        return res.writeHead(404).end(JSON.stringify({message: "Task not found!"}));
      }

      const updateTask = {
        updated_at: new Date(),
        completed_at: !!task.completed_at ? null : new Date()
      }

      database.update("tasks", updateTask, id);

      return res.writeHead(204).end();
    }
  }
]