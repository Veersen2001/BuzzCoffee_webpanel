import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Import the plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

// Register the plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize
);

function Profile() {
  // Form and file states
  const [formData, setFormData] = useState({
    fullName: '',
    restaurantEmail: 'info@technopediasoft.com',
    password: '',
  });

  const [profileImg, setProfileImg] = useState([]);


  // Handle changes for input fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="px-4 py-6 md:overflow-hidden md:px-8 flex-1 flex flex-col">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Profile</h2>
        <p className="text-muted-foreground">Manage your Profile settings.</p>
      </div>
      <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-4 lg:my-6"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="fullName" className="text-md font-medium leading-none">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full"
                placeholder="Enter Full Name"
                required
              />
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="restaurantEmail" className="text-md font-medium leading-none">Your Email</Label>
              <Input
                type="email"
                id="restaurantEmail"
                value={formData.restaurantEmail}
                onChange={handleChange}
                className="mt-1 block w-full"
                readOnly
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <label className="text-md font-medium leading-none" htmlFor="password">Password</label>
               
              </div>
              <div className="relative">
                <Input
                  type='text' // Toggle between text and password
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full pr-10" // Add padding to right for the icon
                  required
                  placeholder="Enter password"
                />
             
              </div>
            </div>

            <Button type="submit" className="w-full mt-4 transform transition duration-200 hover:scale-95">
              Update
            </Button>
          </div>

          <div>
            <h3 className="text-md font-medium leading-none mb-2">Profile Image</h3>
            <FilePond
              files={profileImg}
              onupdatefiles={setProfileImg}
              allowMultiple={false}
              maxFiles={1}
              maxFileSize="2MB"
              name="profileImg"
              server="/api/upload"
              labelIdle="Drag & Drop your file or <span class='filepond--label-action'>Browse</span>"
              acceptedFileTypes={['image/*']}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
