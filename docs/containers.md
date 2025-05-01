# Running and Extending This Project with Containers

## 1. **How This Project Uses Containerization**

- Your project ships with a **Dockerfile** that describes how to build a container image for the app.
- The app container is designed to run using either Docker, Podman, or in orchestrated environments.
- **Multiservice development** is enabled via `docker-compose.yaml` (add services like Postgres easily here).
- All configurations (such as database connection settings) are manged via environment variables.

---

## 2. **Running the App in Docker or Podman**

### **Build and Run the App Container**

#### **Docker**

```bash
docker build -t myapp:latest .
docker run -p 8000:8000 --env-file .env.production myapp:latest
```

#### **Podman**

```bash
podman build -t myapp:latest .
podman run -p 8000:8000 --env-file .env.production myapp:latest
```

---

## 3. **Adding Services (e.g., Postgres) Using Docker Compose**

To add a database or any other service, add a new service to your `docker-compose.yaml`.

**Example (Postgres):**

```yaml
services:
  app:
    build:
      context: .
    ports:
      - "8000:8000"
    env_file:
      - .env.production
    command: [ "bun", "run", "index.ts" ]
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mysecretpassword
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Update your `.env.production`** with:

```text
DATABASE_HOST=postgres
DATABASE_USER=myuser
DATABASE_PASSWORD=mysecretpassword
DATABASE_NAME=mydb
DATABASE_PORT=5432
```

**Bring up containers:**

```bash
docker compose up --build        # Docker Desktop / Docker Compose v2+
podman-compose up --build        # With Podman (if podman-compose installed)
```

*You can add other containers (like cache, etc.) similarly.*

---

## 4. **Running as a Pod with Podman**

Pods allow you to group containers with shared networking.

**Create a Pod:**

```bash
podman pod create --name mypod -p 8000:8000 -p 5432:5432
```

**Run Postgres inside the pod:**

```bash
podman run -d --name postgres --pod mypod \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres:16
```

**Run your app inside the pod:**

```bash
podman run -d --name app --pod mypod \
  --env-file .env.production \
  myapp:latest
```

*Add other containers to the same pod if needed. All containers share the pod’s network.*

---

## 5. **Running in Kubernetes**

### **Step 1: Build and Push Image**

Build the image and push it to a registry (Docker Hub, GitHub, etc.):

```bash
docker build -t yourusername/myapp:latest .
docker push yourusername/myapp:latest
```

### **Step 2: Kubernetes Manifests**

**Example deployment for app and Postgres:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: yourusername/myapp:latest
          envFrom:
            - secretRef:
                name: app-env
          ports:
            - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  ports:
    - port: 8000
  selector:
    app: app
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          env:
            - name: POSTGRES_DB
              value: mydb
            - name: POSTGRES_USER
              value: myuser
            - name: POSTGRES_PASSWORD
              value: mysecretpassword
          ports:
            - containerPort: 5432
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
```

**Configure Secrets:**  
Create a secret (holds environment variables like database credentials):

```bash
kubectl create secret generic app-env --from-env-file=.env.production
```

**Apply changes:**

```bash
kubectl apply -f k8s/
```

*Replace image names, ports, secrets, etc. as needed for your environment.*

---

## 6. **If You Want To Add More Services**

- **Docker Compose / Podman Compose:**  
  Add new service blocks.
- **Podman Pod:**  
  Use `podman run ... --pod mypod` for each new container.
- **Kubernetes:**  
  Add new Deployment and Service resources (or StatefulSets if persistent storage is required).

---

## 7. **Notes**

- **Database host** in your app config should match the service name. For Compose, use the `service` name, for Podman
  pod, use `localhost`, and for Kubernetes, the service DNS name.
- **Environment configuration** is always passed via `.env.production` (or a secret in Kubernetes).
- **Persistence:**  
  For databases, mount a volume in Docker Compose/Podman or use a PersistentVolume in Kubernetes.

---

## 8. **Troubleshooting**

- Check container logs:  
  `docker logs <container_name>` or `podman logs <container_name>`
- View Kubernetes pod logs:  
  `kubectl logs <pod_name>`
- Ensure all containers are healthy before testing the application.

---

**Summary:**  
To containerize or extend this project, update the compose or Kubernetes manifests as above, pass configuration via
environment/secret, and follow the build/run/apply steps with your chosen tool. Adjust service names and ports as
needed—containerization makes the project easily composable in local and cloud workflows.