import SearchBar from '@/components/Searchbar';
import Sidebar from '@/components/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">      
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="p-4">
          <SearchBar />
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
