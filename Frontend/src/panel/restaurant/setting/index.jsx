import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';



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




function Setting() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantEmail: '',
    restaurantPhone: '',
    restaurantTel: '',
    restaurantAddress: '', // New field
  });

  const [restaurantLogo, setRestaurantLogo] = useState([]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className='px-4 py-6 md:overflow-hidden md:px-8 flex-1 flex flex-col'>
      <div className='space-y-0.5'>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h2>
        <p className="text-muted-foreground">Manage your restaurant settings.</p>
      </div>
      <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-4 lg:my-6"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="restaurantName" className="text-md font-medium leading-none">Restaurant</Label>
              <Input
                type="text"
                id="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="mt-1 block w-full"
                placeholder="Enter restaurant Name"
                required
              />
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="restaurantEmail" className="text-md font-medium leading-none">Restaurant Email</Label>
              <Input
                type="email"
                id="restaurantEmail"
                value={formData.restaurantEmail}
                onChange={handleChange}
                className="mt-1 block w-full"
                placeholder="Enter restaurant email"
                required
              />
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="restaurantPhone" className="text-md font-medium leading-none">Restaurant Phone</Label>
              <Input
                type="tel"
                id="restaurantPhone"
                value={formData.restaurantPhone}
                onChange={handleChange}
                className="mt-1 block w-full"
                placeholder="Enter restaurant phone"
                required
              />
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="restaurantTel" className="text-md font-medium leading-none">Tel Number</Label>
              <Input
                type="tel"
                id="restaurantTel"
                value={formData.restaurantTel}
                onChange={handleChange}
                className="mt-1 block w-full"
                placeholder="Enter tel number"
              />
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="restaurantAddress" className="text-md font-medium leading-none">Restaurant Address</Label>
              <textarea
                id="restaurantAddress"
                value={formData.restaurantAddress}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md bg-white  text-[#000]"
                placeholder="Enter restaurant address"
                rows="4" // You can adjust the rows as needed
                required
              ></textarea>
            </div>

            <Button type="submit" className="w-full mt-4 transform transition duration-200 hover:scale-95">
              Update
            </Button>
          </div>
          <div>
            <h3 className="text-md font-medium leading-none mb-2">Restaurant Logo</h3>
            <FilePond
              files={restaurantLogo}
              onupdatefiles={setRestaurantLogo}
              allowMultiple={true}
              maxFiles={1}
              maxFileSize="2MB"
              name="files"
              server="/api/upload"
              labelIdle='Drag & Drop your logo or <span class="filepond--label-action">Browse</span>'
              acceptedFileTypes={['image/*']}
            />

          </div>
          
        </div>
      </form>
    </div>
  );
}

export default Setting;
