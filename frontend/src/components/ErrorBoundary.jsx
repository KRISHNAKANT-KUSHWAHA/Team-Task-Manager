import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected application error"
    };
  }

  componentDidCatch(error, info) {
    console.error("Application error:", error, info);
  }

  handleReload = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-red-700">Something went wrong</p>
            <h1 className="mt-2 text-xl font-bold text-slate-950">The app could not render this screen.</h1>
            <p className="mt-3 text-sm text-slate-600">{this.state.message}</p>
            <button className="btn-primary mt-5" onClick={this.handleReload}>
              Clear session and login
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
