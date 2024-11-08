import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const skillsList = ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Ruby'];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>({
    skills: [],
    projects: [],
    experiences: [],
    education: [],
    certificates: []
  });
  const [pfpFile, setPfpFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      axios.get('/api/user/profile').then(response => {
        setProfileData(response.data.profile || {});
      }).catch(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setProfileData({ ...profileData, skills: e.target.value as string[] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.put('/api/user/profile', profileData)
      .then(() => alert('Profile updated successfully'))
      .catch(() => alert('Profile update failed'));
  };

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPfpFile(e.target.files[0]);
    }
  };

  const handlePfpUpload = () => {
    if (pfpFile) {
      const formData = new FormData();
      formData.append('file', pfpFile);
      axios.post('/api/user/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => alert('Profile picture uploaded successfully'))
        .catch(() => alert('Profile picture upload failed'));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Update Profile</Typography>

      <TextField name="bio" label="Bio" value={profileData.bio || ''} onChange={handleChange} fullWidth multiline rows={4} />

      <TextField name="personal_website" label="Personal Website" value={profileData.personal_website || ''} onChange={handleChange} fullWidth />

      <TextField name="linkedin" label="LinkedIn" value={profileData.linkedin || ''} onChange={handleChange} fullWidth />

      <TextField name="years_of_experience" label="Years of Experience" value={profileData.years_of_experience || ''} onChange={handleChange} fullWidth />

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="skills-label">Skills</InputLabel>
        <Select
          labelId="skills-label"
          multiple
          value={profileData.skills || []}
          //@ts-ignore
          onChange={handleSkillsChange}
          renderValue={(selected) => (selected as string[]).join(', ')}
        >
          {skillsList.map((skill) => (
            <MenuItem key={skill} value={skill}>
              {skill}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Handling projects */}
      {/* Similar forms can be created for experiences, education, certificates, availability */}

      {/* Upload Profile Picture */}
      <Box sx={{ mt: 2 }}>
        <InputLabel>Profile Picture</InputLabel>
        <input type="file" accept="image/*" onChange={handlePfpChange} />
        <Button variant="contained" onClick={handlePfpUpload} sx={{ mt: 1 }}>Upload Picture</Button>
      </Box>

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>Save</Button>
    </Box>
  );
};

export default Profile;