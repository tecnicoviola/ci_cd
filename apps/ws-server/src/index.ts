import { WebSocketServer } from "ws";
import { db, connectDb } from "@repo/db";

const PORT = 3001;

async function startServer() {
  try {
    await connectDb();

    console.log("Database connected successfully");

    const server = new WebSocketServer({
      port: PORT,
    });

    server.on("connection", async (socket) => {
      try {
        const user = await db.orm!.public!.User!.create({
          email: `guest-${crypto.randomUUID()}@example.com`,
          username: `guest_${Math.random().toString(36).slice(2, 10)}`,
        });

        console.log("New user created:", user);

        socket.send(
          JSON.stringify({
            message: "Hi, connected!",
            user,
          })
        );
      } catch (error) {
        console.error("Connection error:", error);

        socket.send(
          JSON.stringify({
            message: "Something went wrong",
          })
        );
      }
    });

    console.log(`WebSocket server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
    process.exit(1);
  }
}

startServer();