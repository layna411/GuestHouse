import socket

for p in [25, 465, 587]:
    try:
        s = socket.create_connection(('smtp.gmail.com', p), timeout=5)
        print(f"Port {p}: Success")
        s.close()
    except Exception as e:
        print(f"Port {p}: Failed ({e})")
