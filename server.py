import http.server
import socketserver
import os
import sys

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Set current directory to the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching for development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    print(f"Starting AURA-WEAR development server...")
    print(f"Workspace root: {script_dir}")
    
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"\n[SUCCESS] Mockup website is running locally.")
            print(f"URL: http://localhost:{PORT}")
            print("\nPress Ctrl+C in this terminal to stop the server.")
            
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}", file=sys.stderr)
        print("Make sure port 8000 is not already in use.", file=sys.stderr)
        sys.exit(1)
