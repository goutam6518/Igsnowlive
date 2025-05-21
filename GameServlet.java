import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.concurrent.ExecutionException;

@WebServlet("/gamed")
public class GameServlet extends HttpServlet {

    @Override
    public void init() throws ServletException {
        try {
            FileInputStream serviceAccount = new FileInputStream("path/to/serviceAccountKey.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
        } catch (IOException e) {
            throw new ServletException("Failed to initialize Firebase", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String gameId = req.getParameter("gameId");
        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();

        out.println("<html><head><title>Game Download</title>");
        out.println("<style>body{text-align:center;font-family:sans-serif;padding:20px}img{width:150px}.btn{padding:10px 20px;background:blue;color:#fff;border:none;border-radius:5px;margin-top:15px;}.info{margin:10px}.nav{position:fixed;bottom:0;width:100%;display:flex;justify-content:space-around;background:#f1f1f1;padding:10px 0;}</style>");
        out.println("</head><body>");

        if (gameId == null || gameId.isEmpty()) {
            out.println("<h2>No game ID provided</h2>");
        } else {
            Firestore db = FirestoreClient.getFirestore();
            try {
                DocumentSnapshot doc = db.collection("games").document(gameId).get().get();
                if (doc.exists()) {
                    String name = doc.getString("name");
                    String uploader = doc.getString("uploader");
                    String logoUrl = doc.getString("logoUrl");
                    String downloadUrl = doc.getString("downloadUrl");
                    Long downloadCount = doc.getLong("downloadCount");
                    String fileSize = doc.getString("fileSize");

                    out.println("<img src='" + logoUrl + "' alt='Game Logo'/>");
                    out.println("<h1>" + name + "</h1>");
                    out.println("<h3>Uploader: " + uploader + "</h3>");
                    out.println("<a class='btn' href='" + downloadUrl + "'>Download</a>");
                    out.println("<div class='info'>Downloads: " + (downloadCount != null ? downloadCount : "0") + "</div>");
                    out.println("<div class='info'>File Size: " + (fileSize != null ? fileSize : "Unknown") + "</div>");
                } else {
                    out.println("<h2>Game not found</h2>");
                }
            } catch (InterruptedException | ExecutionException e) {
                out.println("<h2>Error loading game: " + e.getMessage() + "</h2>");
            }
        }

        out.println("<div class='nav'>");
        out.println("<button onclick=\"location.href='index.html'\">Home</button>");
        out.println("<button onclick=\"location.href='profile.html'\">Profile</button>");
        out.println("</div>");

        out.println("</body></html>");
    }
}
