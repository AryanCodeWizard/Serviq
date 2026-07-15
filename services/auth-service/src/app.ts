import express,{Application,Express} from 'express';
import routes from './routes/auth.routes';
const app: Application=express();


app.use(express.json());


app.use("/",routes);
export default app;