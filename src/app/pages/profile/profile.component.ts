import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgStyle, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  name: string = '';
  email: string = '';
  bio: string = '';
  avatarColor: string = '#6366f1';
  savedAt: string = '';

  private storageKey = 'thero.profile';

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        this.name = data.name || '';
        this.email = data.email || '';
        this.bio = data.bio || '';
        this.avatarColor = data.avatarColor || '#6366f1';
        this.savedAt = data.savedAt || '';
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  get initials(): string {
    if (!this.name.trim()) return '?';
    const parts = this.name.trim().split(/\s+/);
    const first = parts[0][0] || '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase();
  }

  save(): void {
    this.savedAt = new Date().toLocaleString();
    const data = {
      name: this.name,
      email: this.email,
      bio: this.bio,
      avatarColor: this.avatarColor,
      savedAt: this.savedAt
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      // ignore storage errors
    }
  }

  reset(): void {
    this.name = '';
    this.email = '';
    this.bio = '';
    this.avatarColor = '#6366f1';
    this.savedAt = '';
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      // ignore
    }
  }
}
