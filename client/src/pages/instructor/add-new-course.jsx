import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
  mediaUploadService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    const requiredFields = ['title', 'category', 'level', 'primaryLanguage', 'subtitle', 'description', 'pricing', 'objectives', 'welcomeMessage'];
    const isLandingPageValid = requiredFields.every(field => !isEmpty(courseLandingFormData[field]));
    if (!isLandingPageValid) return false;

    const areCurriculumItemsValid = courseCurriculumFormData.every(
      (item) => !isEmpty(item.title) && !isEmpty(item.videoUrl) && !isEmpty(item.public_id)
    );
    if (!areCurriculumItemsValid) return false;

    const hasFreePreview = courseCurriculumFormData.some(
      (item) => item.freePreview
    );

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      let finalCourseFormData = {
        instructorId: auth?.user?._id,
        instructorName: auth?.user?.userName,
        date: new Date(),
        ...courseLandingFormData,
        students: [],
        curriculum: courseCurriculumFormData,
        isPublised: true,
      };

      if (courseLandingFormData.image && courseLandingFormData.image instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("file", courseLandingFormData.image);
        
        try {
          const imageUploadResponse = await mediaUploadService(imageFormData);
          if (imageUploadResponse?.success) {
            finalCourseFormData.image = imageUploadResponse?.data?.url || imageUploadResponse?.data?.secure_url;
          }
        } catch (imageError) {
          // Continue without image upload
        }
      }

      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(
              currentEditedCourseId,
              finalCourseFormData
            )
          : await addNewCourseService(finalCourseFormData);

      if (response?.success) {
        toast({
          title: "Success!",
          description: currentEditedCourseId ? "Course updated successfully!" : "Course created successfully!",
        });
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
        setCurrentEditedCourseId(null);
      } else {
        toast({
          title: "Error!",
          description: response?.message || "Failed to create/update course",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const courseIdFromParams = params?.courseId;

    if (courseIdFromParams) {
      setCurrentEditedCourseId(courseIdFromParams);
      fetchInstructorCourseDetailsService(courseIdFromParams).then((response) => {
        if (response?.success) {
          const { curriculum, ...landingData } = response.data;
          setCourseLandingFormData(landingData);
          setCourseCurriculumFormData(curriculum);
        }
      });
    }
  }, [params?.courseId, setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validateFormData() || isLoading}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          {isLoading ? "SUBMITTING..." : "SUBMIT"}
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
