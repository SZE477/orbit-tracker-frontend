import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

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