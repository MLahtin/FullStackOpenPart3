/* eslint-disable no-unused-vars */
import axios from 'axios'
const baseURL = 'http://localhost:3001/api/persons'

const getAll = () => {
  const request = axios.get(baseURL)
  return request.then((response) => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseURL, newObject)
  return request.then((response) => response.data)
}

const update = async (id, newObject) => {
  const request = await axios.put(`${baseURL}/${id}`, newObject)
  const remainingPersons = getAll()
  return remainingPersons
}
const deleteItem = (id) => {
  const request = axios.delete(`${baseURL}/${id}`)
  return request
}

export default {
  getAll,
  create,
  update,
  deleteItem,
}
