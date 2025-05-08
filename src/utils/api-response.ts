interface ApiSuccessResponse {
  success?: true; // Optional; defaults to true
  message?: string;
  data: object; // Required when successful
  errors?: undefined; // Disallow errors when successful
}

interface ApiFailureResponse {
  success: false;
  message?: string;
  errors: object; // Required when unsuccessful
  data?: undefined; // Disallow data when unsuccessful
}

type ApiResponseProps = ApiSuccessResponse | ApiFailureResponse;

export class ApiResponse {
  public success: boolean;
  public message: string;
  public data?: object;
  public errors?: object;

  constructor(props: ApiResponseProps) {
    // Default success to true if not provided.
    const { success = true, message } = props;
    this.success = success;
    this.message = message || (success ? "Success." : "An error occurred.");

    // If the response is successful, assign the data.
    if (success) {
      // Type assertion is safe here due to the union type.
      this.data = (props as ApiSuccessResponse).data;
      this.errors = undefined;
    } else {
      // For failure, assign the errors instead.
      this.errors = (props as ApiFailureResponse).errors;
      this.data = undefined;
    }
  }
}
