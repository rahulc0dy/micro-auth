# Prisma Setup Guide

## Prerequisites

- Deno installed (version 2.0.0 or higher)
- PostgreSQL database running
- Environment variables configured (see .env.example)

## Setup Steps

1. **Install dependencies**
    ```bash
    deno task deps
    ```
   This command installs all required project dependencies including Prisma.

2. **Install Prisma CLI**
    ```bash
    deno install --allow-scripts=npm:prisma@6.2.1,npm:@prisma/engines@6.2.1
    ```
   This installs Prisma CLI tools for database management.

3. **Create/Modify Schema**

   The Prisma schema is located at `prisma/schema.prisma`. Modify it according to your data model needs.

4. **Pull Database Schema (if using existing database)**
    ```bash
    deno task prisma:pull-db
    ```
   This command introspects your database and updates the Prisma schema.

5. **Generate Prisma Client**
    ```bash
    deno task prisma:generate-client
    ```
   This generates the Prisma client based on your schema.

## Troubleshooting

### Common Issues

1. Permission errors when installing Prisma CLI
    - Solution: see deno and prisma docs
2. Database connection issues
    - Solution: Raise issues

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Deno with Prisma Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-deno-deploy)

