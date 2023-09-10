import createClient from 'openapi-fetch';
import type { paths, components } from './spec';
import { PUBLIC_API_URL } from '$env/static/public';

export const { GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH, TRACE } = createClient<paths>({
	baseUrl: PUBLIC_API_URL
});

export type Class = components['schemas']['GetClassDto'];
export type Subject = components['schemas']['GetSubjectDto'];
export type Lesson = components['schemas']['GetLessonDto'];
export type Metadata = components['schemas']['Metadata'];
