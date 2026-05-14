"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import { Trash2, Download, Upload } from "lucide-react";
import { useState, useRef } from "react";

export default function SettingsPage() {
  const { problemStates, resetProgress } = useTrackerStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(problemStates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dsa-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        // Using zustand persist direct write as a simple hack, or we can use a store method.
        // It's safer to reload page to let persist rehydrate
        localStorage.setItem('dsa-tracker-storage', JSON.stringify({ state: { problemStates: importedData }, version: 0 }));
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
  };

  return (
    <div className="space-y-8 mt-12 lg:mt-0 pb-20 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your data and preferences.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border">
              <div>
                <p className="font-medium">Export Progress</p>
                <p className="text-sm text-muted-foreground">Download your progress as a JSON file.</p>
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border">
              <div>
                <p className="font-medium">Import Progress</p>
                <p className="text-sm text-muted-foreground">Restore your progress from a backup.</p>
              </div>
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImport}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                <span>Import JSON</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium text-danger">Danger Zone</p>
                <p className="text-sm text-muted-foreground">Permanently delete all your progress.</p>
              </div>
              
              {showConfirm ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Confirm Reset
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-danger text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Data</span>
                </button>
              )}
            </div>

          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              This tracker is built around the open-source Data Structures and Algorithms curriculum by Kunal Kushwaha.
            </p>
            <p>
              All your data is saved locally in your browser. No account is required, and everything is 100% free. 
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
