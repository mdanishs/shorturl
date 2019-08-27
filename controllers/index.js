import { insertLongUrl } from "../database";

export const handleUrlShortening = (req, res, next) => {
  insertLongUrl(req)
}