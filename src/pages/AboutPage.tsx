// Simple card components as placeholders
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`border rounded-lg ${className}`}>{children}</div>
);
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="p-4 border-b">{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-semibold">{children}</h3>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div className="p-4">{children}</div>;

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Card>
        <CardHeader>
          <CardTitle>About SatViz</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Orbit Tracker is a real-time 3D satellite orbit tracker built with React, Vite, TypeScript,
            and React Three Fiber. It consumes a Django API to provide up-to-date satellite
            positional data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;