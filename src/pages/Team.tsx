import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Mail, Github, ExternalLink, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Team = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const teamMembers = [
    {
      name: "Dr. Gaurav Ahuja",
      role: "Principal Investigator",
      description: "Associate Professor (CB) at IIIT Delhi.",
      image: "/team/gaurav-ahuja.jpg",
      email: "gaurav.ahuja@iiitd.ac.in",
      website: "https://www.ahuja-lab.in/",
      gscholar: "https://scholar.google.co.in/citations?user=rlqdeCsAAAAJ&hl=en",
    },
    {
      name: "Aayushi Mittal",
      role: "PhD Scholor",
      description: "Data Curation, Core Model Architecture & Development",
      image: "/team/aayushi-mittal.jpg",
      website: "",
      github: "https://github.com/Aayushi006"
    },
    {
      name: "Saveena Solanki",
      role: "PhD Scholar",
      description: "DevOps, Web Hosting And Server Maintenance",
      image: "/team/saveena-solanki.jpg",
      website: "",
      github: "https://github.com/SaveenaSolanki"
    },
    {
      name: "Adnan Raza",
      role: "Student Intern",
      description: "UI/UX design & microservice architecture development",
      image: "/team/adnan-raza.jpg",
      website: "https://woosflex-portfolio.onrender.com/",
      github: "https://www.github.com/woosflex"
    },
    {
      name: "Syed Yasser Ali",
      role: "B.Tech Student",
      description: "Application Backend and User Interface Development",
      image: "/team/syed-yasser-ali.jpg",
      website: "",
      github: "https://github.com/yasservision24/"
    },
    {
      name: "Pranjal Sharma",
      role: "M.Tech Student",
      description: "Application Backend and User Interface Development",
      image: "/team/pranjal-sharma.jpg",
      website: "",
      github: "https://www.github.com/PRANJAL2208"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mx-auto">
            Meet Developers
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The dedicated researchers and developers driving innovation in the EvOlf project
            </p>
          </div>

          {/* Principal Investigator Section */}
          <div className="flex justify-center mb-20">
            <Card className="p-8 max-w-5xl w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                    {teamMembers[0].image ? (
                      <img 
                        src={teamMembers[0].image} 
                        alt={teamMembers[0].name}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      "GA"
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                      Principal Investigator
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                    {teamMembers[0].name}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {teamMembers[0].description}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    {teamMembers[0].email && (
                      <a 
                        href={`mailto:${teamMembers[0].email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">Email</span>
                      </a>
                    )}
                    {teamMembers[0].website && (
                      <a 
                        href={teamMembers[0].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-200 dark:hover:border-green-700 transition-all duration-200"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm font-medium">Website</span>
                      </a>
                    )}
                    {teamMembers[0].gscholar && (
                      <a 
                        href={teamMembers[0].gscholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200"
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-sm font-medium">Google Scholar</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Members Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Research & Development Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our interdisciplinary team combines expertise in computational biology, machine learning, and software engineering
              </p>
            </div>
            
            {/* Grid with perfect alignment for 5 members */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {teamMembers.slice(1).map((member, index) => (
                <Card 
                  key={index} 
                  className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 group"
                >
                  <div className="text-center h-full flex flex-col">
                    {/* Profile Image */}
                    <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:shadow-lg transition-shadow">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        member.name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    
                    {/* Name with optional website link */}
                    <div className="mb-3 flex-grow">
                      {member.website ? (
                        <a 
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{member.name}</h3>
                        </a>
                      ) : (
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{member.name}</h3>
                      )}
                      
                      {/* Role with colored badge */}
                      <div className="mb-3">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          member.role.includes('PhD') 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : member.role.includes('M.Tech') || member.role.includes('B.Tech')
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {member.description}
                      </p>
                    </div>
                    
                    {/* GitHub Link */}
                    <div className="mt-auto pt-4">
                      {member.github && (
                        <a 
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Team;