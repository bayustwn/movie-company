declare module "swagger-ui-react" {
    import type { FC } from "react";

    interface SwaggerUIProps {
        url?: string;
        spec?: object;
        layout?: string;
        docExpansion?: "list" | "full" | "none";
        defaultModelsExpandDepth?: number;
        defaultModelExpandDepth?: number;
        filter?: boolean | string;
        maxDisplayedTags?: number;
        showExtensions?: boolean;
        showCommonExtensions?: boolean;
        supportedSubmitMethods?: string[];
        tryItOutEnabled?: boolean;
        validatorUrl?: string | null;
    }

    const SwaggerUI: FC<SwaggerUIProps>;
    export default SwaggerUI;
}
