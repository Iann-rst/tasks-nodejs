import {randomUUID} from 'node:crypto'
import { Database} from './database.js'

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: '/tasks',

    handler: (req, res)=>{
      const task = {
        id: randomUUID(),
        title: 'Task 1',
        description: 'Descrição detalhada da task',
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
    path: '/tasks',
    handler: (req, res)=>{
      const tasks = database.select('tasks');

      return res.end(JSON.stringify(tasks))
    }
  }
]