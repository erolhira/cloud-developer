import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //http://localhost:8082/filteredimage?image_url=https://kodedu.com/wp-content/uploads/2017/02/java_ee_egitimi.png
  app.get( "/filteredimage", 
    async( req: Request, res: Response ) => {
      let { image_url } = req.query;

      //1. validate the image_url query
      if ( !image_url ) {
        return res.status(400).send(`missing query parameter --> image_url`);
      }

      //2. call filterImageFromURL(image_url) to filter the image
      const path = await filterImageFromURL(image_url);
      
      //3. send the resulting file in the response
      //4. deletes any files on the server on finish of the response
      return res.on('finish',() => deleteLocalFiles([path]))
                .status(200)
                .sendFile(path)      
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();