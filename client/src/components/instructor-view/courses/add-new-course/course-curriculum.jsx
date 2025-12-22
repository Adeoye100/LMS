import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InstructorContext } from "@/context/instructor-context";
import { storage } from "@/config/firebase-config"; // Import your Firebase storage instance
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Upload, X } from "lucide-react";
import { useContext, useState } from "react";
import { Progress } from "@/components/ui/progress";

function CourseCurriculum() {
  const { courseCurriculumFormData, setCourseCurriculumFormData } = useContext(InstructorContext);
  const [uploadingState, setUploadingState] = useState({});

  function handleAddNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { title: "", videoUrl: "", public_id: "", freePreview: false },
    ]);
  }

  function handleFormChange(event, index, field) {
    const updatedData = [...courseCurriculumFormData];
    updatedData[index][field] = event.target.value;
    setCourseCurriculumFormData(updatedData);
  }

  function handleSwitchChange(value, index) {
    const updatedData = [...courseCurriculumFormData];
    updatedData[index].freePreview = value;
    setCourseCurriculumFormData(updatedData);
  }

  async function handleDeleteLecture(index) {
    const lectureToDelete = courseCurriculumFormData[index];
    if (lectureToDelete.public_id) {
      const fileRef = ref(storage, lectureToDelete.public_id);
      try {
        await deleteObject(fileRef);
      } catch (error) {
        console.error("Failed to delete file from Firebase:", error);
        // Optionally show an error to the user
      }
    }
    const updatedData = courseCurriculumFormData.filter((_, i) => i !== index);
    setCourseCurriculumFormData(updatedData);
  }

  function handleFileUpload(event, index) {
    const file = event.target.files[0];
    if (!file) return;

    const filePath = `courses/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.total) * 100;
        setUploadingState(prev => ({ ...prev, [index]: { progress, error: null, status: 'uploading' } }));
      },
      (error) => {
        console.error("Firebase upload failed:", error);
        setUploadingState(prev => ({ ...prev, [index]: { progress: 0, error: "Upload failed. Please try again.", status: 'error' } }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updatedData = [...courseCurriculumFormData];
          updatedData[index].videoUrl = downloadURL;
          updatedData[index].public_id = filePath; // Store the file path as the public_id
          setCourseCurriculumFormData(updatedData);
          setUploadingState(prev => ({ ...prev, [index]: { ...prev[index], status: 'completed' } }));
        });
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {courseCurriculumFormData.map((item, index) => {
          const currentUpload = uploadingState[index];
          return (
            <div key={index} className="border p-4 rounded-lg space-y-4 relative bg-card">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">Lecture {index + 1}</h3>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteLecture(index)} className="text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Lecture Title</Label>
                  <Input
                    id={`title-${index}`}
                    placeholder="e.g., Introduction to React"
                    value={item.title}
                    onChange={(e) => handleFormChange(e, index, "title")}
                  />
                </div>
                <div className="flex items-end space-x-2 pb-1">
                  <Switch
                    id={`freePreview-${index}`}
                    checked={item.freePreview}
                    onCheckedChange={(value) => handleSwitchChange(value, index)}
                  />
                  <Label htmlFor={`freePreview-${index}`}>Free Preview</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`video-${index}`}>Lecture Video</Label>
                {item.videoUrl && !currentUpload ? (
                  <p className="text-sm text-muted-foreground">Video uploaded: {item.public_id}</p>
                ) : (
                  <Input
                    id={`video-${index}`}
                    type="file"
                    accept="video/*,application/pdf"
                    onChange={(e) => handleFileUpload(e, index)}
                    disabled={currentUpload?.status === 'uploading'}
                  />
                )}
              </div>
              {currentUpload && (
                <div className="space-y-2">
                  {currentUpload.status === 'uploading' && (
                    <>
                      <Label>Uploading...</Label>
                      <Progress value={currentUpload.progress} />
                    </>
                  )}
                  {currentUpload.status === 'error' && (
                    <p className="text-sm text-destructive">{currentUpload.error}</p>
                  )}
                  {currentUpload.status === 'completed' && (
                    <p className="text-sm text-green-600">Upload complete!</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <Button variant="outline" onClick={handleAddNewLecture}>
          Add Another Lecture
        </Button>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
