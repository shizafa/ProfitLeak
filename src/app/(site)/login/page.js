"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setCheckingSession(false);
      return;
    }

    supabase.auth.getUser(token).then(({ data, error }) => {
      if (data?.user && !error) {
        router.push('/dashboard');
        return;
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setCheckingSession(false);
    });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return null;
  }

  return (
    <>
      <section
        className="bg-home d-flex align-items-center bg-primary"
        style={{ background: 'url("/images/saas-shape.png") center' }}
      >
        <div className="bg-overlay bg-gradient-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="form-signin p-4 bg-white rounded shadow-md">
                <form onSubmit={handleSubmit}>
                  <Link href="/">
                    <img
                      src="images/image.png"
                      className="mb-4 d-block mx-auto"
                      alt=""
                      style={{ height: '80px' }}
                    />
                  </Link>
                  <h5 className="mb-3">Please  login</h5>
                  {error && (
                    <div className="alert alert-danger py-2" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="form-floating mb-2">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label text-muted"
                          htmlFor="flexCheckDefault"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <span className="forgot-pass text-muted mb-0">
                      <a
                        href="auth-reset-password.html"
                        className="text-muted fw-medium"
                      >
                        Forgot password ?
                      </a>
                    </span>
                  </div>
                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                  <div className="col-12 text-center mt-3">
                    <span>
                      <span className="text-muted me-2">
                        Don't have an account ?
                      </span>{" "}
                      <Link href="/signup" className="text-dark fw-medium">
                        Sign Up
                      </Link>
                    </span>
                  </div>
                  {/*end col*/}
                  <p className="mb-0 text-muted mt-3 text-center">© Profit Leak Founder</p>
                </form>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
    </>
  );
}
