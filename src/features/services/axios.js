import axios from "axios";

export default axios.create({
  baseURL: "http://ws.audioscrobbler.com",
});
