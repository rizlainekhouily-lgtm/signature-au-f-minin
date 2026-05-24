import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async () => {
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Compte créé avec succès 🎉");
  };

  const signIn = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Connexion réussie 💖");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="page-center">Chargement...</div>;

  if (!session) {
    return (
      <div className="page-center">
        <div className="login-card">
          <div className="badge">Signature au Féminin</div>
          <h1>Connexion cliente</h1>
          <p className="subtitle">Connectez-vous pour accéder à votre espace privé.</p>

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="btn-light" onClick={signUp}>Créer un compte</button>
          <button className="btn-dark" onClick={signIn}>Se connecter</button>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <div>
          <div className="badge">Signature au Féminin</div>
          <h1>Espace privé</h1>
          <p>Bienvenue dans votre espace sécurisé.</p>
        </div>
        <button className="logout" onClick={signOut}>Déconnexion</button>
      </header>

      <section className="content-card">
        <h2>Connexion réussie 💖</h2>
        <p>Votre compte est connecté avec :</p>
        <strong>{session.user.email}</strong>

        <div className="grid">
          <div>
            <h3>Suivi</h3>
            <p>Poids, IMC et mensurations seront ici.</p>
          </div>
          <div>
            <h3>Objectifs</h3>
            <p>Vos objectifs personnalisés seront affichés ici.</p>
          </div>
          <div>
            <h3>Séances</h3>
            <p>Vos séances maison 2 jours par semaine seront ici.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
