import React from 'react';
import { useOS } from '../../context/OSContext';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Plus,
  Calendar,
  Building,
} from 'lucide-react';

export const CertificationsApp: React.FC = () => {
  const { certifications, openApp } = useOS();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 select-text space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-white/10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Award className="w-4 h-4" />
            <span>Credentials Registry</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Certifications & Professional Licenses
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified external certifications, technical assessments, and accreditations.
          </p>
        </div>

      </div>

      {/* Certifications Content */}
      {certifications.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/40 border border-white/8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Award className="w-6 h-6 opacity-40" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            No certifications added yet.
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Verified industry certifications, badges, or course credentials can be dynamically added and managed via the <strong>Abhishek Portfolio Control Center</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(certifications || []).map(cert => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-sky-500/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white">{cert.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-sky-400 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>{cert.issuer}</span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  <Calendar className="w-3 h-3" />
                  {cert.issue_date}
                </span>
              </div>

              {cert.description && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cert.description}
                </p>
              )}

              {cert.credential_id && (
                <div className="text-[11px] font-mono text-slate-400">
                  ID: <span className="text-slate-300">{cert.credential_id}</span>
                </div>
              )}

              {cert.credential_url && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-sky-400 hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
