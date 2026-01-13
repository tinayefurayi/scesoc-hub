import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-subtle border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={24} className="text-brand" />
              <span className="font-bold text-xl text-white">SCESoc Hub</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              The central knowledge base for Systems and Computer Engineering students at Carleton University. 
              Built by students, for students.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-brand transition-colors">Course Directory</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Contribute to Wiki</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Past Exams</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Society</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="https://scesoc.ca" target="_blank" className="hover:text-brand transition-colors">Official Website</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Discord Server</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Contact Execs</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Systems and Computer Engineering Society.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}