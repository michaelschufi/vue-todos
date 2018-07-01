import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://example.com:2403/',
  // baseURL: "http://localhost:2403/",
  timeout: 3000,
})

export default axios
