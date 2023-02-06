import fs from 'node:fs/promises';


const databasePath = new URL('../db.json', import.meta.url);

export class Database{

  #database = {}

  constructor(){
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data);
    }).catch(()=>{
      this.#persist();
    })
  }

  #persist(){
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data);
    }else{
      this.#database[table]=[data];
    }

    this.#persist();

    return data;
  }

  select(table, search){
    let data = this.#database[table] ?? [];


    if(search){
      data = data.filter(row => {
        return Object.entries(search).some(([key, value])=> {
          return row[key].includes(value)
        })
      })
    }

    return data;
  }

  update(table, data, id){
    const taskIndex = this.#database[table].findIndex(row => row.id === id);

    if(taskIndex > -1){
      const task = this.#database[table][taskIndex]
      this.#database[table][taskIndex] = {id, ...task, ...data}
      this.#persist()
    }
  }

  delete(table, id){
    const taskIndex = this.#database[table].findIndex(task => task.id === id)

    if(taskIndex > -1){
      this.#database[table].splice(taskIndex, 1);
      this.#persist();
    }
  }
}