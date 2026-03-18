import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/db';
import HabitTracker from './HabitTracker';
import Insights from './Insights';
import Coaching from './Coaching';
import CalendarIntegration from './CalendarIntegration';
import FitnessIntegration from './FitnessIntegration';
import SocialSharing from './SocialSharing';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchHabits = async () => {
      const { data } = await supabase.from('habits').select('*');
      setHabits(data);
    };
    fetchHabits();
  }, []);

  return (
    <div>
      <HabitTracker habits={habits} />
      <Insights habits={habits} />
      <Coaching habits={habits} />
      <CalendarIntegration />
      <FitnessIntegration />
      <SocialSharing />
    </div>
  );
};

export default Dashboard;