import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { useEffect } from "react";
import { usePostData } from "../hooks/usePostData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/UI/dialog";
import { Label } from "../components/UI/label";
import { Input } from "../components/UI/input";
import { Button } from "../components/UI/button";

export default function LocationDialogBox({
  open,
  setOpen,
  selectedLocation,
  setRefetch,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultCustodyLimits = [
    {
      custodyType: "remand_prison",
      spendLimit: "",
      depositLimit: "",
      purchaseStatus: "approved",
    },
    {
      custodyType: "under_trail",
      spendLimit: "",
      depositLimit: "",
      purchaseStatus: "approved",
    },
    {
      custodyType: "contempt_of_court",
      spendLimit: "",
      depositLimit: "",
      purchaseStatus: "approved",
    },
  ];

  const formik = useFormik({
    initialValues: {
      schoolName: "",
      baseUrl: "",
      locationName: "",
    },
    validationSchema: Yup.object({
      schoolName: Yup.string().required("School name is required"),
      baseUrl: Yup.string().required("Base URL is required"),
      locationName: Yup.string().required("Location name is required"),
    }),
    onSubmit: async (values) => {
      const isEdit = Object.keys(selectedLocation ?? {}).length > 0;
      const url = isEdit
        ? `location/${selectedLocation._id}`
        : `location`;
      const method = isEdit ? "put" : "post";

      const { data, error } = await usePostData(url, values, method);

      if (error) {
        enqueueSnackbar(error?.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          isEdit
            ? "Location updated successfully!"
            : "Location created successfully!",
          { variant: "success" }
        );
        setOpen(false);
        setRefetch((prev) => prev + 1);
        formik.resetForm();
        localStorage.setItem("location", JSON.stringify(data?.data));
      }
    },
  });

  // ✅ Update form values safely when editing
  useEffect(() => {
    if (open && selectedLocation) {
      formik.setValues({
        schoolName: selectedLocation?.schoolName || "",
        baseUrl: selectedLocation?.baseUrl || "",
        locationName: selectedLocation?.locationName || "",
        custodyLimits: selectedLocation?.custodyLimits?.length
          ? selectedLocation.custodyLimits
          : defaultCustodyLimits,
      });
    }
  }, [open, selectedLocation]);

  const selectedLocationHaveValue =
    Object.keys(selectedLocation ?? {}).length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            {selectedLocationHaveValue ? "Edit Location" : "Add Location"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Location Name */}
          <div>

            <Label htmlFor="schoolName" className="mb-2">
              School Name
            </Label>
            <Input
              id="schoolName"
              name="schoolName"
              value={formik.values.schoolName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.schoolName &&
              formik.errors.schoolName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.schoolName}
                </p>
              )}

            <Label htmlFor="baseUrl" className="mb-2">
              Base URL
            </Label>
            <Input
              id="baseUrl"
              name="baseUrl"
              value={formik.values.baseUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.baseUrl &&
              formik.errors.baseUrl && (
                <p className="text-red-500 text-sm">
                  {formik.errors.baseUrl}
                </p>
              )}

            <Label htmlFor="locationName" className="mb-2">
              Location Name
            </Label>
            <Input
              id="locationName"
              name="locationName"
              value={formik.values.locationName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.locationName &&
              formik.errors.locationName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.locationName}
                </p>
              )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              {selectedLocationHaveValue ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
