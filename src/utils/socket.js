import { io } from 'socket.io-client';

const socket = io('https://subg-backend.onrender.com', {
  autoConnect: false,
});

export default socket;
