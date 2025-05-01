# Running and Extending This Project with Containers

## 1. **How This Project Uses Containerization**

- This project provides a **Dockerfile** describing how to build a container image for the app.
- The app container can run using Docker, Podman, or in orchestration environments.
- **Multi-service development** is enabled via `docker-compose.yaml`. You can add services like Postgres as needed.
- All configurations (such as database connection settings) are managed via environment variables.

---

## 2. **Running the App in Docker or Podman**

### **Build and Run the App Container**

#### **Docker**

```shell
docker build -t myapp:latest .
docker run -p 8000:8000 --env-file .env.production myapp:latest
```

#### **Podman**

```shell
podman build -t myapp:latest .
podman run -p 8000:8000 --env-file .env.production myapp:latest
```

---

## 3. **Adding Services (e.g., Postgres) Using Docker Compose**

To add a database or other services, define them in `docker-compose.yaml`.

After updating, bring up containers:

```shell
docker compose up --build        # With Docker Compose v2+
podman-compose up --build        # With Podman (if podman-compose installed)
```

You can check that all containers are running with:

```shell
docker ps
# or
podman ps
```

---

## 4. **Running as a Pod with Podman**

**Create and use a pod:**

```shell
podman pod create --name mypod -p 8000:8000 -p 5432:5432
```

Add your containers to this pod using `--pod mypod`.  
Verify running containers and pods:

```shell
podman ps
podman pod ps
```

---

## 5. **Running in Kubernetes**

### **Step 1: Build and Push Image**

Build and push your image to a registry.

---

### **Step 2: Organizing Manifests**

- **Manifests can be split**: For maintainability, place each `Deployment`, `Service`, and Secret in a separate file
  under a `k8s/` directory (e.g., `k8s/app-deployment.yaml`, `k8s/app-service.yaml`, etc.).
- **Kustomize is recommended**: For larger, multi-environment setups,
  use [Kustomize](https://kubectl.docs.kubernetes.io/references/kustomize/) to compose and patch manifests (
  `k8s/kustomization.yaml`).

  Example k8s directory:

```textmate
k8s/
├── app-deployment.yaml
├── app-service.yaml
├── postgres-deployment.yaml
├── postgres-service.yaml
├── app-secret.yaml
└── kustomization.yaml (optional)
```

Apply manifests individually or all at once:

```shell
kubectl apply -f k8s/
# or, for Kustomize
kubectl apply -k k8s/
```

Verify resource creation and pod status:

```shell
kubectl get pods
kubectl get deployments
kubectl get services
```

---

## 6. **Adding More Services**

- **Docker Compose / Podman Compose:**  
  Add new service blocks to your compose YAML.
- **Podman Pod:**  
  Use `podman run ... --pod mypod` for each new container.
- **Kubernetes:**  
  Add more Deployment and Service YAMLs under `k8s/` and apply with `kubectl apply -f` or manage with Kustomize.

---

## 7. **Notes**

- Set your database host in the app config to match the service name. (Compose: the `service` name; Podman: `localhost`;
  Kubernetes: the service DNS name)
- Always pass environment configuration via `.env.production` (or a secret in Kubernetes).
- For persistence, mount a volume in Compose/Podman or use a PersistentVolume in Kubernetes.

---

## 8. **Troubleshooting**

- **Check the status of containers/pods:**
    - `docker ps`
    - `podman ps`
    - `kubectl get pods`
- **Check logs:**
    - `docker logs <container_name>`
    - `podman logs <container_name>`
    - `kubectl logs <pod_name>`
- Ensure all services are running and healthy before testing the application.

---

**Summary:**  
To run or extend this project with containers, adjust your compose or Kubernetes manifests as needed, pass config via
environment/secret, check container or pod status, and follow your preferred tool’s workflow. Organizing manifests and
using Kustomize as your setup grows improves long-term maintainability.