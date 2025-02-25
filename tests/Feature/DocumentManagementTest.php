<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create permissions first
        $permissions = [
            'documents.view',
            'documents.upload',
            'documents.download',
            'documents.delete',
            'documents.move'
        ];

        foreach ($permissions as $permCode) {
            Permission::create([
                'name' => ucwords(str_replace('.', ' ', $permCode)),
                'code' => $permCode,
                'group' => 'Documents'
            ]);
        }

        // Create a test user with necessary permissions
        $this->user = User::factory()->create();
        
        // Attach permissions to user
        $perms = Permission::whereIn('code', $permissions)->get();
        $this->user->permissions()->attach($perms);

        // Create a test category with slug
        $this->category = DocumentCategory::create([
            'name' => 'Test Category',
            'description' => 'Test Description',
            'slug' => 'test-category'
        ]);
    }

    public function test_user_can_view_documents_list()
    {
        $response = $this->actingAs($this->user)
            ->get(route('documents.index'));

        $response->assertStatus(200)
            ->assertInertia(fn ($assert) => $assert
                ->component('Modules/Document/Index')
                ->has('documents')
                ->has('categories')
            );
    }

    public function test_user_can_upload_document()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('test.pdf', 100);

        $response = $this->actingAs($this->user)
            ->post(route('documents.store'), [
                'title' => 'Test Document',
                'file' => $file,
                'category_id' => $this->category->id,
                'description' => 'Test description',
                'documentable_type' => null,
                'documentable_id' => null,
                'tags' => '[]'
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Document uploaded successfully');
        
        $this->assertDatabaseHas('documents', [
            'title' => 'Test Document',
            'category_id' => $this->category->id,
        ]);

        Storage::disk('public')->assertExists('documents/' . $file->hashName());
    }

    public function test_user_can_delete_document()
    {
        $document = Document::factory()->create([
            'category_id' => $this->category->id,
            'documentable_type' => null,
            'documentable_id' => null
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('documents.destroy', $document));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Document deleted successfully.');
        
        $this->assertSoftDeleted($document);
    }

    public function test_batch_document_operations()
    {
        $documents = Document::factory()->count(3)->create([
            'category_id' => $this->category->id,
            'documentable_type' => null,
            'documentable_id' => null
        ]);

        $documentIds = $documents->pluck('id')->toArray();

        // Test batch delete
        $response = $this->actingAs($this->user)
            ->delete(route('documents.batch.destroy'), [
                'documents' => $documentIds
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', count($documentIds) . ' documents moved to trash.');
        
        foreach ($documents as $document) {
            $this->assertSoftDeleted($document);
        }
    }
} 