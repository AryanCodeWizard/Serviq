import express,{Application,Express} from 'express';
import routes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
const app: Application=express();


app.use(express.json());


app.use("/",routes);

//error middleware
app.use(errorHandler);
export default app;