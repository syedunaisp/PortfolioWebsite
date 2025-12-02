# Gravitic Juno - Futuristic Portfolio

A high-performance, visually stunning personal portfolio built with Next.js, featuring a futuristic "Sci-Fi + Artistic Chaos" aesthetic.

## 🚀 Features

-   **Futuristic UI/UX**: Glassmorphism, Neon accents, and Glitch effects.
-   **3D Elements**: Integrated Spline 3D scenes for immersive visuals.
-   **Advanced Animations**: Powered by Framer Motion for smooth transitions and scroll effects.
-   **Admin Dashboard**: Secure CMS to manage Projects, Skills, Experience, and more.
-   **Dynamic Content**:
    -   **Projects**: Masonry layout with deterministic ordering.
    -   **Skills**: Proficiency-based coloring (Green > 90%, etc.).
    -   **Experience**: Timeline view.
-   **Performance**: Optimized with Next.js App Router and Server Components.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **3D**: [Spline](https://spline.design/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd gravitic-juno
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add your database connection string and other secrets:
    ```env
    DATABASE_URL="postgresql://user:password@host/db"
    ADMIN_PASSWORD="your-secure-password"
    ```

4.  **Run Database Migrations**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the site.
    Access the Admin Dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
