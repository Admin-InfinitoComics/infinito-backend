import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
const app = express();
import config from "./config/server-config.js"
import connect from "./config/database-config.js"
import userroutes from "./routes/user-routes.js";
import blogroutes from './routes/blog-routes.js';
import faqRoutes from './routes/faqRoutes.js';
import multer from 'multer';
import adminroutes from './routes/admin-routes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import CareerRoutes from './routes/career-routes.js';
import supportRoutes from './routes/support-routes.js';
import comicRoutes from './routes/comic-routes.js';
import characterRoutes from './routes/character-routes.js';
import researchPaperRoutes from './routes/research-paper-routes.js';
import aboutTimelineRoutes from './routes/aboutTimelineRoutes.js';
import paymentRoutes from './routes/payment-routes.js'
import comicChapRoutes from './routes/comicChap-routes.js'


// ✅ Include all frontend domains here
const allowedOrigins = [
  "https://infinitocomics.com",
  "https://admin.infinitocomics.com",
  "https://foundation.infinitocomics.com",
  "https://research.infinitocomics.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl/Postman) 
    // or if origin is in whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// API Routes
app.use('/api', userroutes);
app.use('/blog', blogroutes);
app.use('/research-papers', researchPaperRoutes); // New research paper routes
app.use('/faq', faqRoutes);
app.use('/admin', adminroutes);
app.use('/timeline', timelineRoutes);
app.use('/timeline/aboutUs', aboutTimelineRoutes);
app.use('/career', CareerRoutes);
app.use('/support', supportRoutes);
app.use('/comic', comicRoutes);
app.use('/comicChap', comicChapRoutes);
app.use('/character', characterRoutes);
app.use('/payment', paymentRoutes);
app.get('/', (req, res) => {
  res.send('🚀 Backend is up and running!');
});

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

const setupandstartserver = async () => {
    app.listen(config.PORT, async () => {
        console.log(`Server started at ${config.PORT}`);
        await connect();
        console.log("mongodb connected");
    })
}

setupandstartserver();
