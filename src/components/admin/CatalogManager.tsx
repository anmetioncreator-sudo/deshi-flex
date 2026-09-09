"use client";

import React, { useState } from 'react';
import { useProductStore, useCategoryStore } from '@/store';
import { Product, Category } from '@/types';
import { Upload, Plus, Trash2, Edit2, X, Folder, ChevronLeft, Image as ImageIcon } from 'lucide-react';

export default function CatalogManager() {
  const products = useProductStore((state) => state.products);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const addProduct = useProductStore((state) => state.addProduct);
  
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Category Form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catBg, setCatBg] = useState('');

  const openCategoryForm = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDesc(cat.desc || '');
      setCatBg(cat.bg || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
      setCatBg('');
    }
    setShowCategoryForm(true);
  };

  // Product Form (Add/Edit)
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<{
    name: string, price: number, originalPrice?: number, categoryId: string, images: string[], 
    colors: string[], sizes: string[], inventory: Record<string, Record<string, number>>
  }>({ name: '', price: 0, originalPrice: 0, categoryId: '', images: [], colors: [], sizes: ['M', 'L', 'XL'], inventory: {} });

  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const handleCatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        alert("Video files are too large for local upload. Please copy your .mp4 file to the project's 'public' folder and type its name (e.g., /video.mp4) in the URL box.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setCatBg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addProdImage = () => {
    setProdForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeProdImage = (idx: number) => {
    setProdForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const updateProdImage = (idx: number, val: string) => {
    setProdForm(prev => {
      const newImgs = [...prev.images];
      newImgs[idx] = val;
      return { ...prev, images: newImgs };
    });
  };

  const handleProdFileUploadIndex = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        alert("Video files are too large for local upload. Please copy your .mp4 file to the project's 'public' folder and type its name (e.g., /video.mp4) in the URL box.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProdImage(idx, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName,
        desc: catDesc,
        bg: catBg || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
      });
      setSuccessMsg('Category updated successfully!');
    } else {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      addCategory({
        id: `cat-${Date.now()}`,
        name: catName,
        slug,
        desc: catDesc,
        bg: catBg || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
      });
      setSuccessMsg('Category created successfully!');
    }
    setCatName('');
    setCatDesc('');
    setCatBg('');
    setShowCategoryForm(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openProductForm = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setProdForm({
        name: p.name, price: p.price, originalPrice: p.originalPrice || 0, categoryId: p.category, 
        images: p.images || [], colors: (p.colors || []).map((c: any) => typeof c === 'string' ? c : c.name), sizes: p.sizes || ['M', 'L', 'XL'], 
        inventory: p.inventory || {}
      });
    } else {
      setEditingProduct(null);
      setProdForm({
        name: '', price: 0, originalPrice: 0, categoryId: selectedCategoryId || '', 
        images: [], colors: [], sizes: ['M', 'L', 'XL'], inventory: {}
      });
    }
    setShowProductForm(true);
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    let totalStock = 0;
    Object.values(prodForm.inventory).forEach(sizeMap => {
      Object.values(sizeMap as Record<string, number>).forEach(qty => { totalStock += qty; });
    });

    const formattedColors = prodForm.colors.map((c: string) => {
      const existing = editingProduct?.colors?.find((ec: any) => ec.name === c);
      return existing ? existing : { name: c, hex: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') };
    });

    if (editingProduct) {
      updateProduct(editingProduct.id, { ...prodForm, colors: formattedColors, category: prodForm.categoryId, totalStock });
      setSuccessMsg('Product updated successfully!');
    } else {
      addProduct({
        id: `PRD-${Date.now()}`,
        ...prodForm,
        colors: formattedColors,
        category: prodForm.categoryId,
        totalStock
      });
      setSuccessMsg('Product created successfully!');
    }
    setShowProductForm(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const addColor = () => {
    if (newColor && !prodForm.colors.includes(newColor)) {
      setProdForm(prev => {
        const newInv = { ...prev.inventory, [newColor]: prev.sizes.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}) };
        return { ...prev, colors: [...prev.colors, newColor], inventory: newInv };
      });
      setNewColor('');
    }
  };

  const removeColor = (c: string) => {
    setProdForm(prev => {
      const newInv = { ...prev.inventory };
      delete newInv[c];
      return { ...prev, colors: prev.colors.filter(col => col !== c), inventory: newInv };
    });
  };

  const removeSize = (s: string) => {
    setProdForm(prev => {
      const newInv = { ...prev.inventory };
      prev.colors.forEach(c => {
        if (newInv[c]) {
          delete newInv[c][s];
        }
      });
      return { ...prev, sizes: prev.sizes.filter(size => size !== s), inventory: newInv };
    });
  };

  const addSize = () => {
    if (newSize && !prodForm.sizes.includes(newSize)) {
      setProdForm(prev => {
        const newInv = { ...prev.inventory };
        prev.colors.forEach(c => { newInv[c] = { ...newInv[c], [newSize]: 0 }; });
        return { ...prev, sizes: [...prev.sizes, newSize], inventory: newInv };
      });
      setNewSize('');
    }
  };

  const updateStock = (color: string, size: string, val: string) => {
    const num = parseInt(val) || 0;
    setProdForm(prev => ({
      ...prev,
      inventory: { ...prev.inventory, [color]: { ...prev.inventory[color], [size]: num } }
    }));
  };

  if (selectedCategoryId) {
    const category = categories.find(c => c.id === selectedCategoryId);
    const categoryProducts = products.filter(p => p.category === category?.slug || p.category === category?.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-background p-4 chrome-border">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCategoryId(null)} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-bold uppercase">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h3 className="text-xl font-bebas tracking-widest text-primary">{category?.name} - Products</h3>
          </div>
          <button onClick={() => openProductForm()} className="px-4 py-2 bg-primary text-foreground font-bold uppercase text-xs flex items-center gap-2 hover:bg-background transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {successMsg && <div className="text-green-400 text-sm font-bold bg-green-900/30 p-3 border border-green-800">{successMsg}</div>}

        <div className="glass-punk p-6">
          {categoryProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No products in this category yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Real Price</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryProducts.map(p => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/10">
                      <td className="p-2 text-sm text-foreground flex items-center gap-3">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 object-cover border border-border" />}
                        {p.name}
                      </td>
                      <td className="p-2 text-sm font-mono text-primary">TK {p.price}</td>
                      <td className="p-2 text-sm font-mono text-muted-foreground line-through">{p.originalPrice ? `TK ${p.originalPrice}` : '-'}</td>
                      <td className="p-2 text-sm font-mono text-accent">{p.totalStock || 0}</td>
                      <td className="p-2 text-right">
                        <button onClick={() => openProductForm(p)} className="text-primary hover:text-foreground p-2">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showProductForm && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-punk p-6 max-w-2xl w-full relative my-8">
              <button onClick={() => setShowProductForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bebas tracking-widest text-primary mb-6 border-b border-border pb-2">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h3>
              
              <form onSubmit={saveProduct} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                    <input type="text" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="w-full industrial-input p-3" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Discount Price</label>
                    <input type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: parseFloat(e.target.value)})} className="w-full industrial-input p-3" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Real Price</label>
                    <input type="number" value={prodForm.originalPrice} onChange={e => setProdForm({...prodForm, originalPrice: parseFloat(e.target.value)})} className="w-full industrial-input p-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Category</label>
                  <select value={prodForm.categoryId} onChange={e => setProdForm({...prodForm, categoryId: e.target.value})} className="w-full industrial-input p-3" required>
                    <option value="" disabled>Select a Category...</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-4 border border-border p-4 bg-background/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Product Media (Images/Videos)</label>
                    <button type="button" onClick={addProdImage} className="text-xs bg-muted px-3 py-1 flex items-center gap-1 hover:text-primary transition-colors">
                      <Plus className="w-3 h-3" /> Add Image
                    </button>
                  </div>
                  
                  {prodForm.images.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No images added. Click "Add Image".</p>
                  )}

                  {prodForm.images.map((img, idx) => (
                    <div key={idx} className="flex gap-4 items-start border-b border-border/50 pb-4 mb-4 last:mb-0 last:border-0 last:pb-0">
                      <div className="w-24 h-24 bg-muted flex-shrink-0 border border-border relative">
                        {img ? (
                          img.includes('video') || img.endsWith('mp4') ? (
                            <video src={img} className="w-full h-full object-cover" autoPlay muted loop />
                          ) : (
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-white">
                          0{idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <input 
                              type="file" 
                              accept="image/*,video/*" 
                              onChange={(e) => handleProdFileUploadIndex(idx, e)} 
                              className="w-full industrial-input p-1.5 text-[10px] file:mr-2 file:py-1 file:px-2 file:border-0 file:bg-primary file:text-foreground hover:file:bg-background" 
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeProdImage(idx)}
                            className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                            title="Remove Image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[9px] text-muted-foreground">Or direct URL:</div>
                        <input 
                          type="text" 
                          value={img} 
                          onChange={e => updateProdImage(idx, e.target.value)} 
                          className="w-full industrial-input p-2 text-xs" 
                          placeholder="https://..." 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Colors and Sizes */}
                <div className="grid grid-cols-2 gap-6 p-4 border border-border bg-background/20">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase mb-2 block">Colors</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {prodForm.colors.map(c => <span key={c} className="text-xs bg-muted/20 px-2 py-1 flex items-center gap-1">{c} <Trash2 className="w-3 h-3 cursor-pointer text-red-500" onClick={() => removeColor(c)}/></span>)}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newColor} onChange={e=>setNewColor(e.target.value)} placeholder="Add Color" className="industrial-input p-2 flex-1 text-xs"/>
                      <button type="button" onClick={addColor} className="bg-muted px-2"><Plus className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase mb-2 block">Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {prodForm.sizes.map(s => <span key={s} className="text-xs bg-muted/20 px-2 py-1 flex items-center gap-1">{s} <Trash2 className="w-3 h-3 cursor-pointer text-red-500" onClick={() => removeSize(s)}/></span>)}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newSize} onChange={e=>setNewSize(e.target.value)} placeholder="Add Size" className="industrial-input p-2 flex-1 text-xs"/>
                      <button type="button" onClick={addSize} className="bg-muted px-2"><Plus className="w-4 h-4"/></button>
                    </div>
                  </div>
                </div>

                {prodForm.colors.length > 0 && prodForm.sizes.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr><th className="p-2 border border-border">Color / Size</th>{prodForm.sizes.map(s => <th key={s} className="p-2 border border-border text-center">{s}</th>)}</tr>
                      </thead>
                      <tbody>
                        {prodForm.colors.map(c => (
                          <tr key={c}>
                            <td className="p-2 border border-border font-bold">{c}</td>
                            {prodForm.sizes.map(s => (
                              <td key={s} className="p-2 border border-border">
                                <input type="number" value={prodForm.inventory[c]?.[s] || ''} onChange={e => updateStock(c, s, e.target.value)} className="w-full bg-background border border-border p-1 text-center" placeholder="0"/>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button type="submit" className="w-full p-4 bg-primary text-foreground font-bold uppercase tracking-widest hover:bg-background transition-colors">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Categories List View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background p-4 chrome-border">
        <h3 className="text-xl font-bebas tracking-widest text-primary">Categories Management</h3>
        <button onClick={() => openCategoryForm()} className="px-4 py-2 bg-primary text-foreground font-bold uppercase text-xs flex items-center gap-2 hover:bg-background transition-colors">
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {successMsg && <div className="text-green-400 text-sm font-bold bg-green-900/30 p-3 border border-green-800">{successMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No categories created yet. Click "Create Category" to start.</p>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="glass-punk p-6 group relative h-40 flex flex-col">
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity cursor-pointer"
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.bg && <img src={cat.bg} alt="" className="w-full h-full object-cover" />}
              </div>
              <div 
                className="relative z-10 flex flex-col items-center justify-center text-center gap-2 h-full cursor-pointer flex-1"
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                <Folder className="w-8 h-8 text-primary" />
                <h4 className="text-xl font-bebas tracking-widest text-foreground group-hover:text-primary transition-colors">{cat.name}</h4>
                <p className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">{products.filter(p => p.category === cat.slug || p.category === cat.id).length} Products</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); openCategoryForm(cat); }}
                className="absolute top-2 right-2 p-2 bg-background/80 text-foreground rounded hover:text-primary hover:bg-background transition-colors z-20"
                title="Edit Category"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {showCategoryForm && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
          <div className="glass-punk p-6 max-w-md w-full relative">
            <button onClick={() => setShowCategoryForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bebas tracking-widest text-primary mb-6 border-b border-border pb-2">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            
            <form onSubmit={saveCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Category Name</label>
                <input type="text" value={catName} onChange={e => setCatName(e.target.value)} className="w-full industrial-input p-3" required placeholder="e.g. Graphic Tees" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Description</label>
                <textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} className="w-full industrial-input p-3 min-h-[80px]" required placeholder="Short description..."/>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Category Banner (Media)</label>
                <input type="file" accept="image/*,video/*" onChange={handleCatFileUpload} className="w-full industrial-input p-2 text-sm file:bg-primary file:text-foreground file:border-0 file:px-4 file:py-2 hover:file:bg-background" />
                <div className="text-[10px] text-muted-foreground mt-1">Or direct URL:</div>
                <input type="text" value={catBg} onChange={e => setCatBg(e.target.value)} className="w-full industrial-input p-2 mt-1" placeholder="https://..."/>
                {catBg && <img src={catBg} alt="Preview" className="w-full h-32 object-cover border border-border mt-2" />}
              </div>
              <button type="submit" className="w-full p-4 bg-primary text-foreground font-bold uppercase tracking-widest hover:bg-background transition-colors mt-6">
                {editingCategory ? 'Save Changes' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
