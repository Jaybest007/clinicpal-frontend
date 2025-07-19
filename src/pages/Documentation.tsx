
const DocumentationPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-slate-800">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">📘 ClinicPal Project Documentation</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🏁 Project Origin & Idea Phase</h2>
        <p>
          ClinicPal was born out of observing how Nigerian clinics still heavily rely on pen-and-paper
          systems to manage patient data, billing, and operations. It was inspired by first-hand discussions
          with health workers and a passion to provide a lightweight, local-fit solution.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🎯 Vision</h2>
        <p>
          To provide a smart, lightweight, and secure platform for managing patient records,
          treatments, billing, and prescriptions all in one digital interface.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">💡 Key Problems ClinicPal Solves</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Lack of proper patient record keeping</li>
          <li>Lost or inaccessible medical history</li>
          <li>Manual billing and receipt generation</li>
          <li>Inefficient prescription tracking</li>
          <li>Unsearchable paper records</li>
          <li>Costly alternatives to EMR systems</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🧱 Technology Stack</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Frontend: React (Vite) + TypeScript</li>
          <li>Backend: Node.js + Express + TypeScript</li>
          <li>Database: PostgreSQL</li>
          <li>Hosting: Vercel (frontend), Render (backend)</li>
          <li>Others: Redis, JWT, Role-based access, GitHub</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🚀 Project Timeline</h2>
        <ul className="space-y-2">
          <li><strong>Week 1–2:</strong> Planning, wireframing, defining MVP</li>
          <li><strong>Week 3–4:</strong> Development (auth, roles, patients, billing, prescriptions)</li>
          <li><strong>Week 5–6:</strong> Testing, deployment, live feedback</li>
          <li><strong>Week 7:</strong> Domain setup, mobile responsiveness, polish</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">✨ Current Features</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Secure login for clinics/staff</li>
          <li>Role-based dashboards</li>
          <li>Patient creation and record keeping</li>
          <li>Treatment note tracking</li>
          <li>Prescription and billing system</li>
          <li>Auto-generated receipts</li>
          <li>Transaction logs</li>
          <li>Session handling and protected routes</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🔧 Ongoing Fixes</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Improving mobile responsiveness</li>
          <li>Fixing redundant API calls</li>
          <li>Rate limiter patch (Redis)</li>
          <li>JWT environment security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🔮 Upcoming Features</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>AI handwriting-to-text report entry</li>
          <li>In-app notifications</li>
          <li>Full PWA conversion</li>
          <li>PDF exportable reports</li>
          <li>Pharmacy inventory module</li>
          <li>Prescription refill tracking</li>
          <li>SMS alerts for patients</li>
          <li>Clinic geo-location & profiles</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">👥 Community & Feedback</h2>
        <p>
          Positive responses from clinic owners, doctors, and early testers have validated the
          usefulness and simplicity of ClinicPal. It continues to improve based on real-world feedback.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🔐 Security Practices</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>JWT auth + role checks</li>
          <li>Rate limiting (in progress)</li>
          <li>Environment-protected secrets</li>
          <li>Helmet middleware integration planned</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">🌍 Domain Info</h2>
        <p>
          <strong>Domain:</strong> clinicpal.ng<br />
          <strong>Frontend:</strong> Vercel<br />
          <strong>Backend:</strong> Render<br />
          <strong>SSL:</strong> Enabled with HTTPS
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">✅ Final Notes</h2>
        <p>
          ClinicPal isn’t just a portfolio piece — it’s a functional product solving real-world challenges
          in healthcare digitization across Nigeria. It represents passion, vision, and real software impact.
        </p>
      </section>
    </div>
  );
};

export default DocumentationPage;
