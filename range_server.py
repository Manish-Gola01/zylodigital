import http.server
import socketserver
import os
import sys

PORT = 8000

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path):
            return super().send_head()

        range_header = self.headers.get('Range')
        if not range_header or not range_header.startswith('bytes='):
            return super().send_head()

        try:
            file_size = os.path.getsize(path)
            range_val = range_header[6:].strip()
            ranges = range_val.split('-')
            start = int(ranges[0]) if ranges[0] else 0
            end = int(ranges[1]) if ranges[1] else file_size - 1

            if start >= file_size or end >= file_size or start > end:
                self.send_error(416, "Requested Range Not Satisfiable")
                return None

            self.send_response(206)
            ctype = self.guess_type(path)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(end - start + 1))
            self.send_header('Last-Modified', self.date_time_string(int(os.path.getmtime(path))))
            self.end_headers()

            f = open(path, 'rb')
            f.seek(start)

            class RangeFile:
                def __init__(self, fp, length):
                    self.fp = fp
                    self.remaining = length
                def read(self, size=-1):
                    if self.remaining <= 0:
                        return b''
                    if size < 0 or size > self.remaining:
                        size = self.remaining
                    data = self.fp.read(size)
                    self.remaining -= len(data)
                    return data
                def close(self):
                    self.fp.close()

            return RangeFile(f, end - start + 1)
        except Exception:
            return super().send_head()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), RangeHTTPRequestHandler) as httpd:
        print(f"Serving HTTP on port {PORT} with Range support...")
        httpd.serve_forever()
