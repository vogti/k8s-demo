# Kubernetes Demo Application

This repository contains a demo application designed to illustrate Kubernetes concepts and best practices for managing containerized applications. The application is a simple forum where users can post messages, and each post is tagged with the node that processed it. This setup is particularly useful for showcasing Kubernetes features such as scaling, load balancing, persistent storage, and failover.


## Features

- **Web-based Forum**: A simple forum where users can post messages.
- **Persistence Options**: Data storage can be configured to use in-memory storage, file storage, or PostgreSQL.
- **Automatic Scaling**: Kubernetes manages the scaling of application replicas.
- **Load Balancing**: The app demonstrates load balancing across multiple instances of the application.
- **Stateful Storage**: Supports persistent storage through Persistent Volumes in Kubernetes.
- **Node Identification**: Displays the node name and IP address that processed each request, useful for load balancing demos.
- **Authentication**: Simple password-protected access to the forum.


## Setup and Installation

### Prerequisites

- **Kubernetes Cluster**: This demo requires a Kubernetes cluster (Minikube, kind, or a cloud provider).
- **kubectl**: Command-line tool for Kubernetes.
- **Docker**: To build and push container images.
- **Persistent Volume**: Required if using file-based persistence.

### Deployment Steps

1. **Configure Secrets**:

   Set up Kubernetes secrets for database credentials and the application password:

   ```bash
   kubectl create secret generic k8s-demo-secrets \
     --from-literal=DB_USER=your-db-user \
     --from-literal=DB_PASSWORD=your-db-password \
     --from-literal=DB_NAME=your-db-name \
     --from-literal=APP_PASSWORD=your-app-password
   ```

2. **Deploy Postgres (Optional)**:

   If using postgres-based persistence, apply the postgres-deployment configuration:

   ```bash
   kubectl apply -f k8s/postgres-deployment.yaml
   kubectl apply -f k8s/init-db-job.yaml
   ```

3. **Deploy Application and Ingress**:

   Apply the Kubernetes deployment and Ingress configurations:

   ```bash
   kubectl apply -f k8s/k8s-demo-deployment.yaml
   kubectl apply -f k8s/ingress.yaml
   ```


### Environment Configuration

The application allows for three persistence options through the `PERSISTENCE_TYPE` environment variable:

- `memory`: In-memory storage (data lost on restart).
- `file`: File-based storage, useful for demonstrations with Persistent Volumes.
- `database`: PostgreSQL database for consistent, shared storage across replicas.

Set the desired persistence type in `k8s-demo-deployment.yaml`:

```yaml
- name: PERSISTENCE_TYPE
  value: "file" # or "memory" or "database"
```

## Kubernetes Concepts Demonstrated

- **Pod Lifecycle and Resiliency**: Shows how Kubernetes restarts failed pods automatically.
- **Scaling**: Demonstrates how scaling out application replicas distributes load.
- **Persistent Storage**: Illustrates the use of Persistent Volumes and StatefulSets (if extended).
- **Load Balancing with Ingress**: Provides load balancing via Kubernetes Ingress.
- **Liveness and Readiness Probes**: Ensures application health and availability for user requests.


## Usage

- **Scaling**: Scale the application by adjusting the `replicas` in the deployment configuration or using:

  ```bash
  kubectl scale deployment k8s-demo --replicas=3
  ```


## Additional Notes

- **Persistence**: File-based persistence requires a Persistent Volume to retain data between pod restarts. Database persistence (PostgreSQL) requires proper setup and configuration.
- **Ingress Configuration**: The Ingress file requires a valid DNS or host configuration to route external traffic.


# Development

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/vogti/k8s-demo.git
   cd k8s-demo
   ```
   
2. **Build the application**:

   ```bash
   npm init -y
   npm install express ws body-parser
   ```

3. **Build and Push Docker Image**:

   Update the Docker image repository name in the deployment file if necessary.

   ```bash
   docker login
   docker build --platform linux/amd64 -t yourusername/k8s-demo ./app
   docker push yourusername/k8s-demo
   ```


## License

This project is licensed under the MIT License.
